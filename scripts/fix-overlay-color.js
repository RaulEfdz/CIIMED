const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

async function fixOverlayColor() {
  try {
    console.log('Updating overlay color to green...')
    
    const result = await prisma.institutionalInfo.updateMany({
      data: {
        overlayColor: '#285C4D'
      }
    })
    
    console.log('Updated overlay color successfully:', result)
    
    // Verify the change
    const institutionalInfo = await prisma.institutionalInfo.findFirst()
    console.log('Current overlay color:', institutionalInfo?.overlayColor)
    
  } catch (error) {
    console.error('Error updating overlay color:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixOverlayColor()