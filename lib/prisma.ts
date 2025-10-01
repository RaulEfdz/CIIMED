import { PrismaClient } from './generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  connectionAttempts: number
}

// Initialize connection attempts counter
if (!globalForPrisma.connectionAttempts) {
  globalForPrisma.connectionAttempts = 0
}

// Create a function to get a fresh Prisma client
function createPrismaClient() {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
  
  // Force connection pooling to be disabled to avoid prepared statement conflicts
  return client
}

// Function to get a fresh connection when needed
export async function getPrismaClient() {
  globalForPrisma.connectionAttempts++
  console.log(`🔄 Creating fresh Prisma connection (attempt ${globalForPrisma.connectionAttempts})`)
  
  // Always disconnect existing client to avoid prepared statement conflicts
  if (globalForPrisma.prisma) {
    try {
      await globalForPrisma.prisma.$disconnect()
    } catch (e) {
      // Ignore disconnect errors
    }
    globalForPrisma.prisma = undefined
  }
  
  // Always create a fresh client to avoid prepared statement caching
  const newClient = createPrismaClient()
  globalForPrisma.prisma = newClient
  
  try {
    // Test the connection
    await newClient.$queryRaw`SELECT 1`
    console.log(`✅ Fresh Prisma connection successful`)
    return newClient
  } catch (error) {
    console.error(`❌ Fresh connection test failed:`, error)
    throw error
  }
}

// Create a Proxy that automatically handles connection issues
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (typeof prop === 'string' && prop.startsWith('$')) {
      // Handle Prisma client methods
      return async (...args: any[]) => {
        const client = await getPrismaClient()
        return (client as any)[prop](...args)
      }
    } else if (typeof prop === 'string') {
      // Handle model operations
      return new Proxy({}, {
        get(modelTarget, modelProp) {
          return async (...args: any[]) => {
            const client = await getPrismaClient()
            return (client as any)[prop][modelProp](...args)
          }
        }
      })
    }
    return undefined
  }
})

// Add connection handling
process.on('beforeExit', async () => {
  if (globalForPrisma.prisma) {
    await globalForPrisma.prisma.$disconnect()
  }
})