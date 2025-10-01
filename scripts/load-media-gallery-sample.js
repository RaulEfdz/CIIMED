const fs = require('fs');
const path = require('path');

// Función para cargar datos de muestra de la galería de medios
async function loadMediaGallerySample() {
  try {
    console.log('🎬 Iniciando carga de datos de muestra para Galería de Medios...');
    
    // Leer el archivo JSON
    const dataPath = path.join(__dirname, '..', 'media-gallery-sample.json');
    const mediaData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log(`📊 Datos leídos: ${mediaData.length} elementos multimedia`);
    
    // Importar Prisma desde el path correcto
    const { PrismaClient } = require('../lib/generated/prisma');
    const prisma = new PrismaClient();
    
    console.log('🔌 Conectado a la base de datos');
    
    // Verificar si ya existen datos
    const existingCount = await prisma.mediaGallery.count();
    console.log(`📈 Elementos existentes en la galería: ${existingCount}`);
    
    if (existingCount > 0) {
      console.log('⚠️  Ya existen elementos en la galería. ¿Deseas continuar? (Esto agregará más elementos)');
      // En un entorno de script, continuamos automáticamente
      console.log('✅ Continuando con la carga...');
    }
    
    // Insertar cada elemento de multimedia
    let successful = 0;
    let errors = 0;
    
    for (const mediaItem of mediaData) {
      try {
        // Convertir capturedAt string a Date si existe
        const processedItem = {
          ...mediaItem,
          capturedAt: mediaItem.capturedAt ? new Date(mediaItem.capturedAt) : null,
          // Asegurar que los arrays estén definidos
          tags: mediaItem.tags || [],
          keywords: mediaItem.keywords || []
        };
        
        const created = await prisma.mediaGallery.create({
          data: processedItem
        });
        
        console.log(`✅ Creado: ${created.title} (${created.type})`);
        successful++;
      } catch (error) {
        console.error(`❌ Error creando ${mediaItem.title}:`, error.message);
        errors++;
      }
    }
    
    // Verificar el resultado final
    const finalCount = await prisma.mediaGallery.count();
    
    console.log('\n🎯 RESUMEN DE CARGA:');
    console.log(`✅ Elementos creados exitosamente: ${successful}`);
    console.log(`❌ Errores: ${errors}`);
    console.log(`📊 Total elementos en galería: ${finalCount}`);
    
    // Mostrar estadísticas por tipo
    console.log('\n📈 ESTADÍSTICAS POR TIPO:');
    const stats = await prisma.mediaGallery.groupBy({
      by: ['type'],
      _count: { type: true },
      where: { published: true }
    });
    
    stats.forEach(stat => {
      console.log(`${stat.type}: ${stat._count.type} elementos`);
    });
    
    await prisma.$disconnect();
    console.log('\n🎉 ¡Datos de galería de medios cargados exitosamente!');
    
  } catch (error) {
    console.error('💥 Error en la carga de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  loadMediaGallerySample();
}

module.exports = { loadMediaGallerySample };