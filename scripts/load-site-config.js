const { PrismaClient } = require('../lib/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function loadSiteConfig() {
  try {
    // Leer el archivo de configuración sample
    const configPath = path.join(__dirname, '..', 'site-config-sample.json');
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    console.log('🔧 Cargando configuración del sitio...');

    // Verificar si ya existe una configuración activa
    const existingConfig = await prisma.siteConfig.findFirst({
      where: { isActive: true }
    });

    if (existingConfig) {
      console.log('⚠️  Ya existe una configuración activa. Actualizando...');
      
      // Actualizar configuración existente
      const updatedConfig = await prisma.siteConfig.update({
        where: { id: existingConfig.id },
        data: {
          ...configData,
          updatedAt: new Date()
        }
      });

      console.log('✅ Configuración del sitio actualizada exitosamente');
      console.log(`📝 ID: ${updatedConfig.id}`);
      console.log(`🌐 Sitio: ${updatedConfig.siteName}`);
      console.log(`🔗 URL: ${updatedConfig.siteUrl}`);
    } else {
      console.log('➕ Creando nueva configuración del sitio...');
      
      // Crear nueva configuración
      const newConfig = await prisma.siteConfig.create({
        data: configData
      });

      console.log('✅ Configuración del sitio creada exitosamente');
      console.log(`📝 ID: ${newConfig.id}`);
      console.log(`🌐 Sitio: ${newConfig.siteName}`);
      console.log(`🔗 URL: ${newConfig.siteUrl}`);
    }

    // Mostrar estadísticas
    const totalConfigs = await prisma.siteConfig.count();
    console.log(`📊 Total de configuraciones en BD: ${totalConfigs}`);

  } catch (error) {
    console.error('❌ Error cargando configuración del sitio:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
  loadSiteConfig();
}

module.exports = { loadSiteConfig };