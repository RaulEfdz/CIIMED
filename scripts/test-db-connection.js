const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a la base de datos...')
    
    // Test 1: Conexión básica
    await prisma.$connect()
    console.log('✅ Conexión establecida')
    
    // Test 2: Consulta simple
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Consulta básica exitosa:', result)
    
    // Test 3: Verificar tablas existentes
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `
      console.log('✅ Tablas encontradas:', tables.length)
      
      // Test 4: Verificar tabla institutional_info
      const institutionalInfo = await prisma.institutionalInfo.findFirst()
      console.log('✅ Datos institucionales:', institutionalInfo ? 'Encontrados' : 'No encontrados')
      
    } catch (tableError) {
      console.warn('⚠️  Error accediendo a las tablas:', tableError.message)
      console.log('💡 Puede que necesites ejecutar: npx prisma db push')
    }
    
    console.log('🎉 Conexión exitosa a la base de datos')
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    
    if (error.message.includes('Can\'t reach database server')) {
      console.log('\n🔧 Posibles soluciones:')
      console.log('1. Verificar que Supabase esté activo en: https://supabase.com/dashboard')
      console.log('2. Comprobar las variables de entorno en .env')
      console.log('3. Verificar la configuración de red/firewall')
      console.log('4. Reintentar en unos minutos (puede ser un problema temporal)')
    }
    
    if (error.message.includes('timeout')) {
      console.log('\n⏱️  Timeout detectado:')
      console.log('1. La conexión está tardando mucho')
      console.log('2. Puede ser un problema de red temporal')
      console.log('3. Reintentar en unos minutos')
    }
    
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()