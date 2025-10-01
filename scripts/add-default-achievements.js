const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addDefaultAchievements() {
  try {
    console.log('Adding default achievement values...')
    
    const result = await prisma.institutionalInfo.updateMany({
      data: {
        achievementResearchValue: '150+',
        achievementResearchDesc: 'Proyectos de investigación completados',
        achievementPatientsValue: '10000+',
        achievementPatientsDesc: 'Personas beneficiadas',
        achievementPublicationsValue: '75+',
        achievementPublicationsDesc: 'Artículos científicos publicados'
      }
    })
    
    console.log('Added default achievements successfully:', result)
    
    // Verify the change
    const institutionalInfo = await prisma.institutionalInfo.findFirst()
    console.log('Current achievements:')
    console.log('- Research:', institutionalInfo?.achievementResearchValue, institutionalInfo?.achievementResearchDesc)
    console.log('- Patients:', institutionalInfo?.achievementPatientsValue, institutionalInfo?.achievementPatientsDesc)
    console.log('- Publications:', institutionalInfo?.achievementPublicationsValue, institutionalInfo?.achievementPublicationsDesc)
    
  } catch (error) {
    console.error('Error adding default achievements:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addDefaultAchievements()