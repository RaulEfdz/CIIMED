import { useState, useEffect, useCallback } from 'react';

export interface ResearchProject {
  id: string;
  
  // Información básica
  title: string;
  slug: string;
  description: string;
  abstract?: string;
  objectives?: string[];
  
  // Clasificación y organización
  researchLine?: string;
  category?: string;
  area?: string;
  status: string;
  priority: number;
  tags?: string[];
  
  // Información temporal
  startDate?: string;
  endDate?: string;
  actualEndDate?: string;
  estimatedDuration?: string;
  currentProgress: number;
  
  // Recursos y financiamiento
  principalInvestigator?: string;
  coInvestigators?: string[];
  budget?: number;
  fundingSource?: string;
  currency?: string;
  currentFunding?: number;
  
  // Documentación y multimedia
  imageUrl?: string;
  imageAlt?: string;
  imgW?: number;
  imgH?: number;
  documentsUrls?: string[];
  publicationsUrls?: string[];
  presentationsUrls?: string[];
  
  // Resultados e impacto
  expectedResults?: string;
  currentResults?: string;
  impactMeasures?: string[];
  publications?: number;
  citations?: number;
  
  // Colaboraciones y participación
  institutionalPartners?: string[];
  internationalPartners?: string[];
  studentParticipants?: number;
  
  // Configuración y metadatos
  featured: boolean;
  published: boolean;
  allowPublicView: boolean;
  link?: string;
  
  // Información técnica
  methodology?: string;
  ethicsApproval?: string;
  equipment?: string[];
  software?: string[];
  
  // Fechas de control
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProjectsResponse {
  success: boolean;
  projects: ResearchProject[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  stats: Record<string, number>;
  filters: {
    search?: string;
    status?: string;
    category?: string;
    researchLine?: string;
    featured?: string;
    published?: string;
  };
}

export interface ResearchProjectFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
  researchLine?: string;
  featured?: boolean;
  published?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const useResearchProjects = () => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<ResearchProjectsResponse['pagination'] | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});

  const fetchProjects = useCallback(async (filters: ResearchProjectFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Construir query string
      const queryParams = new URLSearchParams();
      
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.limit) queryParams.append('limit', filters.limit.toString());
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.researchLine) queryParams.append('researchLine', filters.researchLine);
      if (filters.featured !== undefined) queryParams.append('featured', filters.featured.toString());
      if (filters.published !== undefined) queryParams.append('published', filters.published.toString());
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/research-projects?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ResearchProjectsResponse = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
        setPagination(data.pagination);
        setStats(data.stats || {});
      } else {
        throw new Error('Error al obtener proyectos de investigación');
      }
    } catch (err) {
      console.error('Error fetching research projects:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(async (projectData: Partial<ResearchProject>) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/research-projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return { success: true, project: data.project, message: data.message };
      } else {
        throw new Error(data.error || 'Error al crear proyecto de investigación');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateProject = useCallback(async (id: string, updates: Partial<ResearchProject>) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/research-projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Actualizar el proyecto en el estado local
        setProjects(prev => prev.map(project => 
          project.id === id ? { ...project, ...data.project } : project
        ));
        return { success: true, project: data.project, message: data.message };
      } else {
        throw new Error(data.error || 'Error al actualizar proyecto de investigación');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/research-projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Remover el proyecto del estado local
        setProjects(prev => prev.filter(project => project.id !== id));
        return { success: true, message: data.message };
      } else {
        throw new Error(data.error || 'Error al eliminar proyecto de investigación');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const batchUpdate = useCallback(async (action: string, projectIds: string[], updates: any = {}) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/research-projects`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, projectIds, updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return { success: true, message: data.message, updatedCount: data.updatedCount };
      } else {
        throw new Error(data.error || 'Error en actualización masiva');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const batchDelete = useCallback(async (projectIds: string[]) => {
    try {
      setError(null);
      
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/research-projects`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Remover proyectos del estado local
        setProjects(prev => prev.filter(project => !projectIds.includes(project.id)));
        return { success: true, message: data.message, deletedCount: data.deletedCount };
      } else {
        throw new Error(data.error || 'Error al eliminar proyectos');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Cargar proyectos al montar el hook
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    setProjects,
    isLoading,
    error,
    pagination,
    stats,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    batchUpdate,
    batchDelete,
    refetch: fetchProjects
  };
};

// Funciones helper para obtener valores con fallbacks
export const getProjectStatus = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    planning: { label: 'Planificación', color: 'bg-gray-100 text-gray-800' },
    active: { label: 'Activo', color: 'bg-green-100 text-green-800' },
    paused: { label: 'Pausado', color: 'bg-yellow-100 text-yellow-800' },
    completed: { label: 'Completado', color: 'bg-blue-100 text-blue-800' },
    cancelled: { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
  };
  
  return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
};

export const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 60) return 'bg-blue-500';
  if (progress >= 40) return 'bg-yellow-500';
  if (progress >= 20) return 'bg-orange-500';
  return 'bg-red-500';
};

export const formatBudget = (budget: number | undefined, currency: string = 'USD') => {
  if (!budget) return 'No especificado';
  
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(budget);
};

export const getProjectDuration = (startDate?: string, endDate?: string) => {
  if (!startDate || !endDate) return 'No especificado';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  
  if (diffMonths < 12) {
    return `${diffMonths} mes${diffMonths !== 1 ? 'es' : ''}`;
  } else {
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    let result = `${years} año${years !== 1 ? 's' : ''}`;
    if (months > 0) {
      result += ` y ${months} mes${months !== 1 ? 'es' : ''}`;
    }
    return result;
  }
};