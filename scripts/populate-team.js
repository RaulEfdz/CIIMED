const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

const teamData = [
  // Directivos
  {
    name: "Dr. David Forren",
    position: "Director Ejecutivo",
    department: "Dirección General",
    email: "david.forren@ciimed.pa",
    bio: "Director ejecutivo del CIIMED con amplia experiencia en administración de centros de investigación médica.",
    linkedIn: "https://linkedin.com/in/davidforren",
    website: "https://ciimed.pa/team/david-forren",
    specialties: ["Administración Científica", "Gestión de Investigación", "Medicina Tropical"],
    type: "DIRECTOR",
    order: 1
  },
  {
    name: "Dra. María González",
    position: "Directora de Investigación",
    department: "Dirección Científica",
    email: "maria.gonzalez@ciimed.pa",
    phone: "+507 123-4567",
    bio: "Doctora en Medicina con especialización en Medicina Tropical. 15 años de experiencia en investigación biomédica.",
    linkedIn: "https://linkedin.com/in/mariagonzalez",
    specialties: ["Medicina Tropical", "Investigación Clínica", "Enfermedades Infecciosas"],
    type: "DIRECTOR",
    order: 2
  },
  {
    name: "Dr. Roberto Silva",
    position: "Director Administrativo",
    department: "Dirección Administrativa",
    email: "roberto.silva@ciimed.pa",
    bio: "Especialista en administración de proyectos de investigación y gestión de recursos.",
    linkedIn: "https://linkedin.com/in/robertosilva",
    specialties: ["Gestión de Proyectos", "Administración", "Finanzas"],
    type: "DIRECTOR",
    order: 3
  },

  // Investigadores
  {
    name: "Dr. Carlos Mendoza",
    position: "Investigador Senior",
    department: "Oncología",
    email: "carlos.mendoza@ciimed.pa",
    bio: "Investigador especializado en oncología molecular con múltiples publicaciones internacionales.",
    linkedIn: "https://linkedin.com/in/carlosmendoza",
    website: "https://ciimed.pa/research/oncology",
    specialties: ["Oncología", "Biología Molecular", "Investigación Clínica"],
    type: "RESEARCHER",
    order: 1
  },
  {
    name: "Dra. Ana Patricia López",
    position: "Investigadora Principal",
    department: "Enfermedades Infecciosas",
    email: "ana.lopez@ciimed.pa",
    bio: "Especialista en enfermedades tropicales y medicina preventiva con enfoque en salud pública.",
    linkedIn: "https://linkedin.com/in/analopez",
    specialties: ["Enfermedades Infecciosas", "Medicina Preventiva", "Salud Pública"],
    type: "RESEARCHER",
    order: 2
  },
  {
    name: "Dr. Miguel Herrera",
    position: "Investigador Asociado",
    department: "Neurociencias",
    email: "miguel.herrera@ciimed.pa",
    bio: "Investigador en neurociencias con enfoque en enfermedades neurodegenerativas.",
    linkedIn: "https://linkedin.com/in/miguelherrera",
    specialties: ["Neurociencias", "Enfermedades Neurodegenerativas", "Neurología"],
    type: "RESEARCHER",
    order: 3
  },

  // Colaboradores
  {
    name: "Lic. Sofia Vargas",
    position: "Coordinadora de Proyectos",
    department: "Gestión de Proyectos",
    email: "sofia.vargas@ciimed.pa",
    phone: "+507 123-4568",
    bio: "Coordinadora especializada en gestión de proyectos de investigación biomédica.",
    linkedIn: "https://linkedin.com/in/sofiavargas",
    specialties: ["Gestión de Proyectos", "Investigación Biomédica", "Coordinación"],
    type: "COLLABORATOR",
    order: 1
  },
  {
    name: "Dr. Luis Morales",
    position: "Consultor Científico",
    department: "Asesoría Científica",
    email: "luis.morales@ciimed.pa",
    bio: "Consultor externo especializado en metodología de investigación y bioestadística.",
    linkedIn: "https://linkedin.com/in/luismorales",
    website: "https://biostat-consulting.com",
    specialties: ["Bioestadística", "Metodología de Investigación", "Análisis de Datos"],
    type: "COLLABORATOR",
    order: 2
  },
  {
    name: "Lic. Carmen Ruiz",
    position: "Especialista en Comunicaciones",
    department: "Comunicaciones",
    email: "carmen.ruiz@ciimed.pa",
    bio: "Especialista en comunicación científica y divulgación de resultados de investigación.",
    linkedIn: "https://linkedin.com/in/carmenruiz",
    specialties: ["Comunicación Científica", "Divulgación", "Relaciones Públicas"],
    type: "COLLABORATOR",
    order: 3
  }
]

async function populateTeam() {
  try {
    console.log('🚀 Iniciando población de datos del equipo...')

    // Limpiar datos existentes
    await prisma.teamMember.deleteMany({})
    console.log('🧹 Datos previos eliminados')

    // Insertar nuevos datos
    for (const member of teamData) {
      const created = await prisma.teamMember.create({
        data: member
      })
      console.log(`✅ Creado: ${created.name} - ${created.position}`)
    }

    console.log(`🎉 ¡Población completada! ${teamData.length} miembros del equipo creados.`)

    // Mostrar resumen por tipo
    const summary = await prisma.teamMember.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    })

    console.log('\n📊 Resumen por tipo:')
    for (const group of summary) {
      const typeLabel = {
        'DIRECTOR': 'Directivos',
        'RESEARCHER': 'Investigadores', 
        'COLLABORATOR': 'Colaboradores',
        'STAFF': 'Personal'
      }[group.type] || group.type

      console.log(`   ${typeLabel}: ${group._count.id}`)
    }

  } catch (error) {
    console.error('❌ Error poblando datos del equipo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

populateTeam()