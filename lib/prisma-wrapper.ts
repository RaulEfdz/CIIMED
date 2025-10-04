import { prisma } from './prisma'
import { fallbackInstitutionalInfo, fallbackSiteConfig } from './fallback-data'
import { getTempInstitutionalData, saveTempInstitutionalData } from './temp-storage'

// Datos de fallback para noticias
const fallbackNews = [
  {
    id: 'fallback-1',
    title: 'Bienvenidos a CIIMED',
    description: 'Centro de Investigación e Innovación Médica - Un referente en investigación y desarrollo en salud en Panamá.',
    content: 'Somos un centro líder en investigación médica, comprometido con la excelencia científica y la innovación en salud pública.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
    imageAlt: 'CIIMED - Centro de Investigación',
    imgW: 800,
    imgH: 600,
    link: null,
    author: 'Equipo CIIMED',
    readTime: '3 min',
    slug: 'bienvenidos-ciimed',
    featured: true,
    published: true,
    tags: ['institucional', 'bienvenida'],
    metaTitle: 'Bienvenidos a CIIMED',
    metaDescription: 'Centro de Investigación e Innovación Médica en Panamá',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Datos de fallback para eventos
const fallbackEvents = [
  {
    id: 'fallback-event-1',
    title: 'Conferencia de Investigación Médica',
    description: 'Conferencia anual sobre los últimos avances en investigación médica en Panamá.',
    content: 'Únete a nosotros en nuestra conferencia anual donde presentaremos los últimos hallazgos y avances en investigación médica.',
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
    imageAlt: 'Conferencia médica',
    imgW: 800,
    imgH: 600,
    eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días desde hoy
    endDate: null,
    location: 'Ciudad de la Salud, Panamá',
    speaker: 'Dr. Juan Pérez',
    category: 'Conferencia',
    capacity: 100,
    registrationUrl: null,
    featured: true,
    published: true,
    tags: ['investigación', 'medicina', 'conferencia'],
    metaTitle: 'Conferencia de Investigación Médica - CIIMED',
    metaDescription: 'Conferencia anual sobre avances en investigación médica',
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

// Datos de fallback para team
const fallbackTeam = [
  {
    id: 'fallback-team-1',
    name: 'Dr. Ana Rodríguez',
    position: 'Directora de Investigación',
    department: 'Dirección General',
    email: 'ana.rodriguez@ciimed.pa',
    phone: '+507 1234-5678',
    bio: 'Doctora en Medicina con especialización en investigación clínica. Líder en proyectos de innovación médica en Panamá.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    linkedIn: 'https://linkedin.com/in/ana-rodriguez',
    website: null,
    specialties: ['Investigación Clínica', 'Innovación Médica', 'Administración'],
    type: 'DIRECTOR',
    order: 1,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fallback-team-2', 
    name: 'Dr. Carlos Méndez',
    position: 'Investigador Senior',
    department: 'Investigación y Desarrollo',
    email: 'carlos.mendez@ciimed.pa',
    phone: '+507 1234-5679',
    bio: 'Investigador especializado en medicina preventiva y salud pública con más de 10 años de experiencia.',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    linkedIn: 'https://linkedin.com/in/carlos-mendez',
    website: null,
    specialties: ['Medicina Preventiva', 'Salud Pública', 'Epidemiología'],
    type: 'RESEARCHER',
    order: 2,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'fallback-team-3',
    name: 'Dra. María García',
    position: 'Coordinadora de Proyectos',
    department: 'Administración',
    email: 'maria.garcia@ciimed.pa',
    phone: '+507 1234-5680',
    bio: 'Administradora especializada en gestión de proyectos científicos y coordinación institucional.',
    avatar: 'https://images.unsplash.com/photo-1594824388634-d7d9c5c79170?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    linkedIn: 'https://linkedin.com/in/maria-garcia',
    website: null,
    specialties: ['Gestión de Proyectos', 'Administración', 'Coordinación'],
    type: 'STAFF',
    order: 3,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DatabaseConnectionError'
  }
}

export async function getInstitutionalInfoSafe() {
  try {
    const info = await prisma.institutionalInfo.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    return { institutionalInfo: info, error: null, usingFallback: false }
  } catch (error) {
    console.warn('Database connection failed, using fallback data with temp changes:', error)
    
    // Obtener datos temporales guardados
    const tempData = getTempInstitutionalData()
    
    // Merge fallback data con cambios temporales
    const mergedData = tempData 
      ? { ...fallbackInstitutionalInfo, ...tempData }
      : fallbackInstitutionalInfo
    
    return { 
      institutionalInfo: mergedData, 
      error: error as Error, 
      usingFallback: true 
    }
  }
}

export async function getSiteConfigSafe() {
  try {
    const config = await prisma.siteConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    // Si no hay configuración en la base de datos, usar fallback
    if (!config) {
      console.log('No site config found in database, using fallback data')
      return { 
        siteConfig: fallbackSiteConfig, 
        error: null, 
        usingFallback: true 
      }
    }
    
    return { siteConfig: config, error: null, usingFallback: false }
  } catch (error) {
    console.warn('Database connection failed, using fallback site config:', error)
    return { 
      siteConfig: fallbackSiteConfig, 
      error: error as Error, 
      usingFallback: true 
    }
  }
}

export async function updateInstitutionalInfoSafe(data: any) {
  try {
    // Primero intentar obtener información existente
    const existingInfo = await prisma.institutionalInfo.findFirst()
    if (!existingInfo) {
      throw new DatabaseConnectionError('No institutional info found to update')
    }
    
    // Intentar actualizar en la base de datos
    const updated = await prisma.institutionalInfo.update({
      where: { id: existingInfo.id },
      data: {
        ...data,
        foundingYear: data.foundingYear ? parseInt(data.foundingYear) : existingInfo.foundingYear
      }
    })
    
    return { institutionalInfo: updated, error: null, usingFallback: false }
  } catch (error) {
    console.warn('Database connection failed for update, saving to temp storage:', error)
    
    // Guardar cambios en almacenamiento temporal
    saveTempInstitutionalData(data)
    
    // Obtener datos temporales completos
    const tempData = getTempInstitutionalData()
    
    // Crear datos actualizados con cambios temporales
    const updatedFallbackData = {
      ...fallbackInstitutionalInfo,
      ...tempData,
      foundingYear: data.foundingYear ? parseInt(data.foundingYear) : fallbackInstitutionalInfo.foundingYear,
      updatedAt: new Date().toISOString()
    }
    
    return { 
      institutionalInfo: updatedFallbackData, 
      error: error as Error, 
      usingFallback: true 
    }
  }
}

// Funciones seguras para noticias
export async function getNewsSafe(options: {
  includeUnpublished?: boolean
  featured?: boolean
  limit?: number
  search?: string
} = {}) {
  try {
    let whereClause: any = {}
    
    if (!options.includeUnpublished) {
      whereClause.published = true
    }
    
    if (options.featured) {
      whereClause.featured = true
    }
    
    if (options.search) {
      whereClause.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
        { author: { contains: options.search, mode: 'insensitive' } }
      ]
    }

    const news = await prisma.news.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: options.limit
    })

    return { news, error: null, usingFallback: false }
  } catch (error) {
    console.warn('Database connection failed for news, using fallback:', error)
    
    // Filtrar noticias de fallback según opciones
    let filteredNews = [...fallbackNews]
    
    if (!options.includeUnpublished) {
      filteredNews = filteredNews.filter(n => n.published)
    }
    
    if (options.featured) {
      filteredNews = filteredNews.filter(n => n.featured)
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase()
      filteredNews = filteredNews.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.description.toLowerCase().includes(searchLower) ||
        n.author.toLowerCase().includes(searchLower)
      )
    }
    
    if (options.limit) {
      filteredNews = filteredNews.slice(0, options.limit)
    }
    
    return { 
      news: filteredNews, 
      error: error as Error, 
      usingFallback: true 
    }
  }
}

// Funciones seguras para eventos
export async function getEventsSafe(options: {
  includeUnpublished?: boolean
  featured?: boolean
  limit?: number
  search?: string
  category?: string
  upcoming?: boolean
} = {}) {
  try {
    let whereClause: any = {}
    
    if (!options.includeUnpublished) {
      whereClause.published = true
    }
    
    if (options.featured) {
      whereClause.featured = true
    }
    
    if (options.category && options.category !== 'Todos') {
      whereClause.category = options.category
    }
    
    if (options.upcoming) {
      whereClause.eventDate = {
        gte: new Date()
      }
    }
    
    if (options.search) {
      whereClause.OR = [
        { title: { contains: options.search, mode: 'insensitive' } },
        { description: { contains: options.search, mode: 'insensitive' } },
        { location: { contains: options.search, mode: 'insensitive' } }
      ]
      
      // Add speaker search if speaker field exists
      whereClause.OR.push({
        AND: [
          { speaker: { not: null } },
          { speaker: { contains: options.search, mode: 'insensitive' } }
        ]
      })
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { eventDate: 'asc' }
      ],
      take: options.limit
    })

    return { events, error: null, usingFallback: false }
  } catch (error) {
    console.warn('Database connection failed for events, using fallback:', error)
    
    // Filtrar eventos de fallback según opciones
    let filteredEvents = [...fallbackEvents]
    
    if (!options.includeUnpublished) {
      filteredEvents = filteredEvents.filter(e => e.published)
    }
    
    if (options.featured) {
      filteredEvents = filteredEvents.filter(e => e.featured)
    }
    
    if (options.category && options.category !== 'Todos') {
      filteredEvents = filteredEvents.filter(e => e.category === options.category)
    }
    
    if (options.upcoming) {
      const now = new Date()
      filteredEvents = filteredEvents.filter(e => new Date(e.eventDate) >= now)
    }
    
    if (options.search) {
      const searchLower = options.search.toLowerCase()
      filteredEvents = filteredEvents.filter(e => 
        e.title.toLowerCase().includes(searchLower) ||
        e.description.toLowerCase().includes(searchLower) ||
        e.location.toLowerCase().includes(searchLower) ||
        (e.speaker && e.speaker.toLowerCase().includes(searchLower))
      )
    }
    
    if (options.limit) {
      filteredEvents = filteredEvents.slice(0, options.limit)
    }
    
    return { 
      events: filteredEvents, 
      error: error as Error, 
      usingFallback: true 
    }
  }
}

// Funciones seguras para team
export async function getTeamSafe(options: {
  type?: string
  includeInactive?: boolean
} = {}) {
  try {
    const where: any = {}
    
    // Filtrar por tipo si se especifica
    if (options.type && options.type !== 'all') {
      where.type = options.type.toUpperCase()
    }
    
    // Solo mostrar activos por defecto, a menos que se solicite incluir inactivos
    if (!options.includeInactive) {
      where.status = 'ACTIVE'
    }

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    })

    return { teamMembers, error: null, usingFallback: false }
  } catch (error) {
    console.warn('Database connection failed for team, using fallback:', error)
    
    // Filtrar team de fallback según opciones
    let filteredTeam = [...fallbackTeam]
    
    if (options.type && options.type !== 'all') {
      filteredTeam = filteredTeam.filter(member => 
        member.type === options.type.toUpperCase()
      )
    }
    
    if (!options.includeInactive) {
      filteredTeam = filteredTeam.filter(member => member.status === 'ACTIVE')
    }
    
    return { 
      teamMembers: filteredTeam, 
      error: error as Error, 
      usingFallback: true 
    }
  }
}