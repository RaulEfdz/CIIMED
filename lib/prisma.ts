import { PrismaClient } from './generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with optimized configuration for Supabase
function createPrismaClient() {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  })
}

// Get or create a singleton Prisma client
function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient()
  }
  return globalForPrisma.prisma
}

// Export the singleton client
export const prisma = getPrismaClient()

// Cleanup on exit
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}