import { ResearchProject } from "@/hooks/useResearchProjects";

// Función para convertir datos de la DB al formato del componente ResearchProjectCard
export const generateResearchProjectCardData = (projectsArray: ResearchProject[]) => {
  // Solo retornar datos de la base de datos - NO HAY FALLBACKS
  if (!projectsArray || projectsArray.length === 0) {
    return [];
  }

  return projectsArray.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.imageUrl || '', // Solo imagen de Supabase, sin placeholder
    imageAlt: project.imageAlt || project.title,
    status: project.status,
    category: project.category || 'General',
    researchLine: project.researchLine || 'Sin línea específica',
    area: project.area || 'Área general',
    priority: project.priority,
    tags: project.tags || [],
    currentProgress: project.currentProgress,
    principalInvestigator: project.principalInvestigator || 'No asignado',
    coInvestigators: project.coInvestigators || [],
    budget: project.budget,
    currency: project.currency || 'USD',
    fundingSource: project.fundingSource || 'No especificado',
    startDate: project.startDate,
    endDate: project.endDate,
    estimatedDuration: project.estimatedDuration,
    publications: project.publications || 0,
    citations: project.citations || 0,
    featured: project.featured,
    link: project.link || `/research-projects/${project.slug}`,
    slug: project.slug,
    objectives: project.objectives || [],
    expectedResults: project.expectedResults,
    currentResults: project.currentResults,
    methodology: project.methodology,
    equipment: project.equipment || [],
    software: project.software || [],
    institutionalPartners: project.institutionalPartners || [],
    internationalPartners: project.internationalPartners || [],
    studentParticipants: project.studentParticipants || 0,
    impactMeasures: project.impactMeasures || [],
    documentsUrls: project.documentsUrls || [],
    publicationsUrls: project.publicationsUrls || [],
    presentationsUrls: project.presentationsUrls || [],
    ethicsApproval: project.ethicsApproval,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  }));
};

// Función para obtener estadísticas rápidas de un conjunto de proyectos
export const getProjectsStats = (projects: ResearchProject[]) => {
  if (!projects || projects.length === 0) {
    return {
      total: 0,
      active: 0,
      completed: 0,
      planning: 0,
      paused: 0,
      cancelled: 0,
      featured: 0,
      totalBudget: 0,
      averageProgress: 0,
      totalPublications: 0,
      totalCitations: 0
    };
  }

  const stats = projects.reduce((acc, project) => {
    // Contadores por estado
    acc[project.status] = (acc[project.status] || 0) + 1;
    
    // Proyectos destacados
    if (project.featured) acc.featured++;
    
    // Presupuesto total
    if (project.budget) acc.totalBudget += project.budget;
    
    // Progreso acumulado
    acc.progressSum += project.currentProgress;
    
    // Publicaciones y citas
    if (project.publications) acc.totalPublications += project.publications;
    if (project.citations) acc.totalCitations += project.citations;
    
    return acc;
  }, {
    active: 0,
    completed: 0,
    planning: 0,
    paused: 0,
    cancelled: 0,
    featured: 0,
    totalBudget: 0,
    progressSum: 0,
    totalPublications: 0,
    totalCitations: 0
  } as any);

  return {
    total: projects.length,
    active: stats.active,
    completed: stats.completed,
    planning: stats.planning,
    paused: stats.paused,
    cancelled: stats.cancelled,
    featured: stats.featured,
    totalBudget: stats.totalBudget,
    averageProgress: Math.round(stats.progressSum / projects.length),
    totalPublications: stats.totalPublications,
    totalCitations: stats.totalCitations
  };
};

// Función para filtrar proyectos por múltiples criterios
export const filterProjects = (
  projects: ResearchProject[],
  filters: {
    search?: string;
    status?: string;
    category?: string;
    researchLine?: string;
    featured?: boolean;
    minProgress?: number;
    maxProgress?: number;
  }
) => {
  return projects.filter(project => {
    // Filtro de búsqueda por texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        project.title.toLowerCase().includes(searchLower) ||
        project.description.toLowerCase().includes(searchLower) ||
        (project.abstract && project.abstract.toLowerCase().includes(searchLower)) ||
        (project.principalInvestigator && project.principalInvestigator.toLowerCase().includes(searchLower)) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchLower)));
      
      if (!matchesSearch) return false;
    }

    // Filtro por estado
    if (filters.status && project.status !== filters.status) {
      return false;
    }

    // Filtro por categoría
    if (filters.category && project.category !== filters.category) {
      return false;
    }

    // Filtro por línea de investigación
    if (filters.researchLine && project.researchLine !== filters.researchLine) {
      return false;
    }

    // Filtro por destacados
    if (filters.featured !== undefined && project.featured !== filters.featured) {
      return false;
    }

    // Filtro por rango de progreso
    if (filters.minProgress !== undefined && project.currentProgress < filters.minProgress) {
      return false;
    }

    if (filters.maxProgress !== undefined && project.currentProgress > filters.maxProgress) {
      return false;
    }

    return true;
  });
};

// Función para ordenar proyectos por diferentes criterios
export const sortProjects = (
  projects: ResearchProject[],
  sortBy: 'title' | 'priority' | 'progress' | 'startDate' | 'budget' | 'publications' | 'updatedAt',
  order: 'asc' | 'desc' = 'desc'
) => {
  return [...projects].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'priority':
        aValue = a.priority;
        bValue = b.priority;
        break;
      case 'progress':
        aValue = a.currentProgress;
        bValue = b.currentProgress;
        break;
      case 'startDate':
        aValue = a.startDate ? new Date(a.startDate).getTime() : 0;
        bValue = b.startDate ? new Date(b.startDate).getTime() : 0;
        break;
      case 'budget':
        aValue = a.budget || 0;
        bValue = b.budget || 0;
        break;
      case 'publications':
        aValue = a.publications || 0;
        bValue = b.publications || 0;
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Función para agrupar proyectos por categoría
export const groupProjectsByCategory = (projects: ResearchProject[]) => {
  return projects.reduce((groups, project) => {
    const category = project.category || 'Sin categoría';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(project);
    return groups;
  }, {} as Record<string, ResearchProject[]>);
};

// Función para agrupar proyectos por línea de investigación
export const groupProjectsByResearchLine = (projects: ResearchProject[]) => {
  return projects.reduce((groups, project) => {
    const line = project.researchLine || 'Sin línea específica';
    if (!groups[line]) {
      groups[line] = [];
    }
    groups[line].push(project);
    return groups;
  }, {} as Record<string, ResearchProject[]>);
};

// Función para obtener proyectos relacionados (misma línea o categoría)
export const getRelatedProjects = (
  currentProject: ResearchProject,
  allProjects: ResearchProject[],
  limit: number = 3
) => {
  return allProjects
    .filter(project => 
      project.id !== currentProject.id &&
      (project.researchLine === currentProject.researchLine ||
       project.category === currentProject.category)
    )
    .slice(0, limit);
};

// Ya no hay datos estáticos - todo viene de la base de datos