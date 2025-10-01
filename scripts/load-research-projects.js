const { PrismaClient } = require('../lib/generated/prisma');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient({
  log: ['error'],
});

async function loadResearchProjects() {
  try {
    console.log('🚀 Iniciando carga de proyectos de investigación...');

    // Leer el archivo JSON
    const projectsPath = path.join(__dirname, 'research-projects-sample.json');
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

    console.log(`📊 Se encontraron ${projectsData.length} proyectos para cargar`);

    // Limpiar datos existentes (opcional)
    const existingCount = await prisma.researchProject.count();
    console.log(`📋 Proyectos existentes en la base de datos: ${existingCount}`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const projectData of projectsData) {
      try {
        // Verificar si el proyecto ya existe por slug
        const existingProject = await prisma.researchProject.findUnique({
          where: { slug: projectData.slug }
        });

        if (existingProject) {
          // Actualizar proyecto existente
          await prisma.researchProject.update({
            where: { slug: projectData.slug },
            data: {
              ...projectData,
              updatedAt: new Date()
            }
          });
          updatedCount++;
          console.log(`✅ Actualizado: ${projectData.title}`);
        } else {
          // Crear nuevo proyecto
          await prisma.researchProject.create({
            data: {
              ...projectData,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
          createdCount++;
          console.log(`🆕 Creado: ${projectData.title}`);
        }
      } catch (projectError) {
        console.error(`❌ Error con el proyecto "${projectData.title}":`, projectError.message);
      }
    }

    console.log('\n📈 Resumen de la carga:');
    console.log(`   ✅ Proyectos creados: ${createdCount}`);
    console.log(`   🔄 Proyectos actualizados: ${updatedCount}`);
    console.log(`   ⚠️  Errores: ${projectsData.length - createdCount - updatedCount}`);

    // Verificar el total final
    const finalCount = await prisma.researchProject.count();
    console.log(`\n📊 Total de proyectos en la base de datos: ${finalCount}`);

    // Mostrar estadísticas por estado
    const statusStats = await prisma.researchProject.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    console.log('\n📋 Distribución por estado:');
    statusStats.forEach(stat => {
      console.log(`   ${stat.status}: ${stat._count.status} proyectos`);
    });

  } catch (error) {
    console.error('❌ Error general al cargar proyectos:', error);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión a la base de datos cerrada');
  }
}

// Ejecutar el script
loadResearchProjects()
  .then(() => {
    console.log('✅ Script completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });