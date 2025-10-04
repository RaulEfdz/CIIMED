/**
 * Configuración de mapeo entre secciones del menú público y secciones administrativas
 */

export interface PublicSection {
  id: string;
  label: string;
  href: string;
  adminSections: string[];
  description: string;
}

export interface AdminSection {
  id: string;
  title: string;
  description: string;
  publicSections: string[];
  tags: string[];
  icon: string;
  color: string;
  hoverColor: string;
}

// Mapeo de secciones públicas a administrativas
export const publicToAdminMapping: PublicSection[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    href: '/',
    adminSections: ['site-config'],
    description: 'Página principal del sitio web'
  },
  {
    id: 'sobre-nosotros',
    label: 'Sobre Nosotros',
    href: '/about',
    adminSections: ['institutional', 'team'],
    description: 'Información institucional y equipo de trabajo'
  },
  {
    id: 'areas-investigacion',
    label: 'Áreas de Investigación',
    href: '/research-areas',
    adminSections: ['research-projects'],
    description: 'Proyectos y líneas de investigación activas'
  },
  {
    id: 'formacion-capacitacion',
    label: 'Formación y Capacitación',
    href: '/training',
    adminSections: ['events'],
    description: 'Cursos, talleres y programas de formación'
  },
  {
    id: 'alianzas-estrategicas',
    label: 'Alianzas Estratégicas',
    href: '/partnerships',
    adminSections: ['institutional'],
    description: 'Información sobre alianzas y colaboraciones'
  },
  {
    id: 'participa-nosotros',
    label: 'Participa con Nosotros',
    href: '/get-involved',
    adminSections: ['events'],
    description: 'Oportunidades de participación y colaboración'
  },
  {
    id: 'divulgacion-cientifica',
    label: 'Divulgación Científica',
    href: '/scientificDissemination',
    adminSections: ['news', 'media-gallery'],
    description: 'Artículos, noticias y recursos multimedia'
  },
  {
    id: 'contacto',
    label: 'Contacto',
    href: '/contact',
    adminSections: ['institutional'],
    description: 'Información de contacto y ubicación'
  }
];

// Configuración de secciones administrativas con etiquetas
export const adminSectionsConfig: AdminSection[] = [
  {
    id: 'team',
    title: 'Equipo de Trabajo',
    description: 'Gestionar staff, investigadores y personal del CIIMED',
    publicSections: ['sobre-nosotros'],
    tags: ['personal', 'investigadores', 'staff', 'equipo'],
    icon: 'Users',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700'
  },
  {
    id: 'institutional',
    title: 'Información Institucional',
    description: 'Datos sobre el centro, misión, visión y valores',
    publicSections: ['sobre-nosotros', 'alianzas-estrategicas', 'contacto'],
    tags: ['institucional', 'misión', 'visión', 'valores', 'historia', 'contacto'],
    icon: 'Building2',
    color: 'bg-emerald-600',
    hoverColor: 'hover:bg-emerald-700'
  },
  {
    id: 'news',
    title: 'Noticias y Publicaciones',
    description: 'Artículos, noticias y comunicados del CIIMED',
    publicSections: ['divulgacion-cientifica'],
    tags: ['noticias', 'publicaciones', 'artículos', 'comunicados', 'prensa'],
    icon: 'Newspaper',
    color: 'bg-purple-600',
    hoverColor: 'hover:bg-purple-700'
  },
  {
    id: 'events',
    title: 'Eventos y Actividades',
    description: 'Workshops, conferencias y eventos del CIIMED',
    publicSections: ['formacion-capacitacion', 'participa-nosotros'],
    tags: ['eventos', 'workshops', 'conferencias', 'talleres', 'capacitación'],
    icon: 'Calendar',
    color: 'bg-indigo-600',
    hoverColor: 'hover:bg-indigo-700'
  },
  {
    id: 'research-projects',
    title: 'Proyectos de Investigación',
    description: 'Gestionar líneas de investigación y proyectos activos',
    publicSections: ['areas-investigacion'],
    tags: ['investigación', 'proyectos', 'líneas', 'estudios', 'ciencia'],
    icon: 'FileText',
    color: 'bg-orange-600',
    hoverColor: 'hover:bg-orange-700'
  },
  {
    id: 'media-gallery',
    title: 'Galería de Medios',
    description: 'Imágenes, videos y recursos multimedia',
    publicSections: ['divulgacion-cientifica'],
    tags: ['multimedia', 'imágenes', 'videos', 'galería', 'recursos'],
    icon: 'Image',
    color: 'bg-pink-600',
    hoverColor: 'hover:bg-pink-700'
  },
  {
    id: 'site-config',
    title: 'Configuración del Sitio',
    description: 'Configuraciones generales y metadatos',
    publicSections: ['inicio'],
    tags: ['configuración', 'metadatos', 'SEO', 'general', 'sitio'],
    icon: 'Settings',
    color: 'bg-gray-600',
    hoverColor: 'hover:bg-gray-700'
  }
];

/**
 * Obtener secciones administrativas relacionadas con una sección pública
 */
export function getAdminSectionsForPublic(publicSectionId: string): AdminSection[] {
  const publicSection = publicToAdminMapping.find(section => section.id === publicSectionId);
  if (!publicSection) return [];
  
  return adminSectionsConfig.filter(adminSection => 
    publicSection.adminSections.includes(adminSection.id)
  );
}

/**
 * Obtener secciones públicas relacionadas con una sección administrativa
 */
export function getPublicSectionsForAdmin(adminSectionId: string): PublicSection[] {
  const adminSection = adminSectionsConfig.find(section => section.id === adminSectionId);
  if (!adminSection) return [];
  
  return publicToAdminMapping.filter(publicSection => 
    adminSection.publicSections.includes(publicSection.id)
  );
}

/**
 * Buscar secciones administrativas por etiquetas
 */
export function searchAdminSectionsByTag(tag: string): AdminSection[] {
  return adminSectionsConfig.filter(section => 
    section.tags.some(sectionTag => 
      sectionTag.toLowerCase().includes(tag.toLowerCase())
    )
  );
}

/**
 * Obtener configuración completa de mapeo para navegación rápida
 */
export function getNavigationMapping() {
  return {
    publicToAdmin: publicToAdminMapping,
    adminSections: adminSectionsConfig,
    quickLinks: [
      { from: 'Inicio', to: 'site-config', type: 'page-config' },
      { from: 'Sobre Nosotros', to: 'institutional', type: 'content' },
      { from: 'Sobre Nosotros', to: 'team', type: 'people' },
      { from: 'Áreas de Investigación', to: 'research-projects', type: 'content' },
      { from: 'Divulgación Científica', to: 'news', type: 'content' },
      { from: 'Divulgación Científica', to: 'media-gallery', type: 'media' }
    ]
  };
}