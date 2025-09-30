const { PrismaClient } = require('../lib/generated/prisma')

const prisma = new PrismaClient()

const teamMembers = [
  // Directivos
  {
    name: "Dr. David Forren",
    position: "Director Ejecutivo",
    department: "Dirección General",
    email: "david.forren@ciimed.pa",
    bio: "Director ejecutivo del CIIMED con amplia experiencia en administración de centros de investigación médica.",
    linkedIn: "https://linkedin.com/in/davidforren",
    website: "https://ciimed.pa/team/david-forren",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    specialties: ["Administración Científica", "Gestión de Investigación"],
    type: "DIRECTOR",
    order: 1
  },
  {
    name: "Dra. María González",
    position: "Directora de Investigación",
    department: "Dirección Científica",
    email: "maria.gonzalez@ciimed.pa",
    bio: "Doctora en Medicina con especialización en Medicina Tropical. Líder en investigación biomédica.",
    linkedIn: "https://linkedin.com/in/mariagonzalez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    specialties: ["Medicina Tropical", "Investigación Clínica"],
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
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    specialties: ["Gestión de Proyectos", "Administración"],
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
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    specialties: ["Oncología", "Biología Molecular"],
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
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c9c4c2f0?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    specialties: ["Enfermedades Infecciosas", "Medicina Preventiva"],
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
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    specialties: ["Neurociencias", "Enfermedades Neurodegenerativas"],
    type: "RESEARCHER",
    order: 3
  },

  // Colaboradores
  {
    name: "Lic. Sofia Vargas",
    position: "Coordinadora de Proyectos",
    department: "Gestión de Proyectos",
    email: "sofia.vargas@ciimed.pa",
    bio: "Coordinadora especializada en gestión de proyectos de investigación biomédica.",
    linkedIn: "https://linkedin.com/in/sofiavargas",
    avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    specialties: ["Gestión de Proyectos", "Investigación Biomédica"],
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
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    specialties: ["Bioestadística", "Metodología de Investigación"],
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
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    specialties: ["Comunicación Científica", "Divulgación"],
    type: "COLLABORATOR",
    order: 3
  }
]

async function seedTeam() {
  try {
    console.log('🌱 Seeding team members...')

    // Limpiar datos existentes
    await prisma.teamMember.deleteMany({})
    console.log('🧹 Cleared existing team members')

    // Insertar nuevos miembros
    for (const member of teamMembers) {
      const created = await prisma.teamMember.create({
        data: member
      })
      console.log(`✅ Created: ${created.name} - ${created.position}`)
    }

    console.log(`🎉 Successfully seeded ${teamMembers.length} team members!`)

    // Mostrar resumen
    const counts = await prisma.teamMember.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    })

    console.log('\n📊 Team summary:')
    counts.forEach(count => {
      const label = {
        'DIRECTOR': 'Directivos',
        'RESEARCHER': 'Investigadores',
        'COLLABORATOR': 'Colaboradores'
      }[count.type] || count.type
      
      console.log(`   ${label}: ${count._count.id}`)
    })

  } catch (error) {
    console.error('❌ Error seeding team:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTeam()