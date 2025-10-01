const { PrismaClient } = require('../lib/generated/prisma')
const newsData = require('../news-sample.json')
const eventsData = require('../events-sample.json')

async function populateNewsAndEvents() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🗞️  Iniciando población de noticias y eventos...')
    
    // Poblar noticias
    console.log('📰 Poblando noticias...')
    for (const news of newsData) {
      try {
        await prisma.news.create({
          data: {
            title: news.title,
            description: news.description,
            content: news.content,
            imageUrl: news.imageUrl,
            imageAlt: news.imageAlt,
            imgW: news.imgW,
            imgH: news.imgH,
            link: news.link,
            author: news.author,
            readTime: news.readTime,
            slug: news.slug,
            featured: news.featured,
            published: news.published,
            tags: news.tags,
            metaTitle: news.metaTitle,
            metaDescription: news.metaDescription,
            publishedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        console.log(`✅ Noticia creada: ${news.title}`)
      } catch (error) {
        console.log(`⚠️  Noticia ya existe o error: ${news.title}`)
      }
    }
    
    // Poblar eventos
    console.log('📅 Poblando eventos...')
    for (const event of eventsData) {
      try {
        await prisma.event.create({
          data: {
            title: event.title,
            description: event.description,
            content: event.content,
            imageUrl: event.imageUrl,
            imageAlt: event.imageAlt,
            imgW: event.imgW,
            imgH: event.imgH,
            link: event.link,
            date: event.date,
            time: event.time,
            location: event.location,
            speaker: event.speaker,
            speakers: event.speakers,
            category: event.category,
            slug: event.slug,
            featured: event.featured,
            published: event.published,
            capacity: event.capacity,
            price: event.price,
            currency: event.currency,
            tags: event.tags,
            eventDate: new Date(event.eventDate),
            registrationEnd: event.registrationEnd ? new Date(event.registrationEnd) : null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })
        console.log(`✅ Evento creado: ${event.title}`)
      } catch (error) {
        console.log(`⚠️  Evento ya existe o error: ${event.title}`)
      }
    }
    
    console.log('\n🎉 ¡Población completada exitosamente!')
    console.log(`📰 ${newsData.length} noticias procesadas`)
    console.log(`📅 ${eventsData.length} eventos procesados`)
    
  } catch (error) {
    console.error('❌ Error durante la población:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  populateNewsAndEvents()
}

module.exports = { populateNewsAndEvents }