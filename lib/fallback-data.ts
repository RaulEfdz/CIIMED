// Datos de respaldo temporal para cuando la base de datos no esté disponible

export const fallbackInstitutionalInfo = {
  id: 'fallback-1',
  name: 'CIIMED',
  description: 'Un referente en investigación y desarrollo en salud en Panamá',
  subtitle: 'Centro de Investigación e Innovación Médica',
  mission: 'Promover la investigación científica y el desarrollo de tecnologías médicas innovadoras para mejorar la salud y calidad de vida de la población panameña y regional.',
  vision: 'Ser el centro de referencia en investigación médica e innovación tecnológica en América Latina, contribuyendo al avance de la medicina y la salud pública.',
  values: [
    'Excelencia científica',
    'Innovación tecnológica', 
    'Compromiso social',
    'Ética profesional',
    'Colaboración interdisciplinaria'
  ],
  history: 'El Centro de Investigación e Innovación Médica (CIIMED) fue fundado en 2020 con el objetivo de fortalecer la capacidad investigativa en Panamá y contribuir al desarrollo de soluciones médicas innovadoras.',
  address: 'Ciudad de Panamá, Panamá',
  phone: '+507 1234-5678',
  email: 'info@ciimed.pa',
  website: 'https://ciimed.pa',
  foundingYear: 2020,
  logo: '/logo.png',
  image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80',
  heroImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80',
  historyImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675&q=80',
  instagramUrl: 'https://instagram.com/ciimed',
  linkedinUrl: 'https://linkedin.com/company/ciimed',
  youtubeUrl: 'https://youtube.com/@ciimed',
  spotifyUrl: 'https://spotify.com/ciimed',
  feature1Title: 'Investigación Avanzada',
  feature1Text: 'Desarrollamos investigación de vanguardia en diversas áreas de la medicina.',
  feature2Title: 'Colaboraciones Estratégicas',
  feature2Text: 'Trabajamos con instituciones nacionales e internacionales de prestigio.',
  overlayColor: '#285C4D',
  footerBrand: 'CIIMED',
  footerEmail: 'contacto@ciimed.pa',
  footerPhone: '+507 1234-5678',
  footerAddress: 'Ciudad de Panamá, Panamá',
  footerCopyright: '© 2024 CIIMED. Todos los derechos reservados.',
  footerBackgroundColor: '#285C4D',
  footerTextColor: '#ffffff',
  footerAccentColor: '#F4633A',
  achievementResearchValue: '150+',
  achievementResearchDesc: 'Proyectos de investigación completados',
  achievementPatientsValue: '10000+',
  achievementPatientsDesc: 'Personas beneficiadas',
  achievementPublicationsValue: '75+',
  achievementPublicationsDesc: 'Artículos científicos publicados',
  status: 'ACTIVE' as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

export const fallbackSiteConfig = {
  id: 'fallback-config-1',
  
  // Metadatos básicos del sitio
  siteName: 'CIIMED',
  siteDescription: 'Centro de Investigación e Innovación Médica - Panamá',
  siteKeywords: ['medicina', 'investigación', 'salud', 'ciencia'],
  siteUrl: 'https://ciimed.pa',
  
  // SEO y metadatos específicos
  metaTitle: 'CIIMED - Centro de Investigación e Innovación en Medicina',
  metaDescription: 'Ubicado en la Ciudad de la Salud, este centro es un referente en investigación y desarrollo en el ámbito de la salud en Panamá.',
  ogImage: '',
  ogDescription: '',
  
  // Información de contacto global
  globalEmail: 'info@ciimed.pa',
  globalPhone: '+507 123-4567',
  globalAddress: 'Ciudad de la Salud, Panamá',
  emergencyContact: '',
  
  // Branding y logos
  primaryLogo: '/highlights/Logo.png',
  secondaryLogo: '/logo_blanco.png',
  favicon: '/favicon.ico',
  
  // Colores del tema
  primaryColor: '#285C4D',
  secondaryColor: '#F4633A',
  accentColor: '#212322',
  lightColor: '#f2f2f2',
  
  // Redes sociales
  facebookUrl: '',
  twitterUrl: '',
  linkedinUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  
  // Navegación principal
  mainNavLinks: [
    { label: "Inicio", href: "/" },
    { label: "Sobre Nosotros", href: "/about" },
    { label: "Áreas de Investigación", href: "/research-areas" },
    { label: "Formación y Capacitación", href: "/training" },
    { label: "Alianzas Estratégicas", href: "/partnerships" },
    { label: "Participa con Nosotros", href: "/get-involved" },
    { label: "Divulgación Científica", href: "/scientificDissemination" },
    { label: "Contacto", href: "/contact" }
  ],
  
  // Mensajes del sistema
  notFoundTitle: 'Página no encontrada',
  notFoundMessage: 'No se pudo encontrar el recurso solicitado.',
  notFoundButton: 'Volver a la página principal',
  
  // Configuración técnica
  isActive: true,
  version: '1.0.0',
  
  // Fechas de control
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}