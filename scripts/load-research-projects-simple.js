const { prisma } = require('../lib/prisma.ts');
const fs = require('fs');
const path = require('path');

async function loadResearchProjects() {
  try {
    console.log('🚀 Iniciando carga de proyectos de investigación...');

    // Leer el archivo JSON
    const projectsPath = path.join(__dirname, 'research-projects-sample.json');
    const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

    console.log(`📊 Se encontraron ${projectsData.length} proyectos para cargar`);

    let createdCount = 0;
    let errorCount = 0;

    for (const projectData of projectsData) {
      try {
        // Crear nuevo proyecto
        await prisma.researchProject.create({
          data: {
            ...projectData,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        createdCount++;
        console.log(`✅ Creado: ${projectData.title}`);
      } catch (projectError) {
        errorCount++;
        if (projectError.code === 'P2002') {
          console.log(`⚠️  Ya existe: ${projectData.title} (slug: ${projectData.slug})`);
        } else {
          console.error(`❌ Error con el proyecto "${projectData.title}":`, projectError.message);
        }
      }
    }

    console.log('\n📈 Resumen de la carga:');
    console.log(`   ✅ Proyectos creados: ${createdCount}`);
    console.log(`   ⚠️  Ya existían o errores: ${errorCount}`);

    // Verificar el total final
    const finalCount = await prisma.researchProject.count();
    console.log(`\n📊 Total de proyectos en la base de datos: ${finalCount}`);

  } catch (error) {
    console.error('❌ Error general al cargar proyectos:', error);
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