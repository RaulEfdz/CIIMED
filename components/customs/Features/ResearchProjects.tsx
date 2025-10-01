"use client"
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc,
  Target,
  TrendingUp,
  Users,
  Award,
  Calendar,
  DollarSign
} from 'lucide-react';
import ResearchProjectCard, { ResearchProjectCardProps } from '../Cards/ResearchProjectCard';
import { TopScroll } from '../TopScroll';
import { useResearchProjects } from "@/hooks/useResearchProjects";
import { generateResearchProjectCardData, getProjectsStats } from "@/app/data/research-projects";

interface ResearchProjectsProps {
  projects?: ResearchProjectCardProps[];
  search?: boolean;
  useDynamicData?: boolean;
  showStats?: boolean;
  compact?: boolean;
  featuredOnly?: boolean;
  limit?: number;
}

const ResearchProjects: React.FC<ResearchProjectsProps> = ({ 
  projects: propProjects, 
  search = true, 
  useDynamicData = true,
  showStats = true,
  compact = false,
  featuredOnly = false,
  limit
}) => {
  // ALL HOOKS MUST BE CALLED AT THE TOP - NO CONDITIONAL HOOKS
  const { projects: dynamicProjects, isLoading, error, fetchProjects } = useResearchProjects();
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedResearchLine, setSelectedResearchLine] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Determinar qué datos usar
  const projectsData = useMemo(() => {
    if (useDynamicData) {
      let processedProjects = generateResearchProjectCardData(dynamicProjects);
      
      // Filtrar solo destacados si se requiere
      if (featuredOnly) {
        processedProjects = processedProjects.filter(project => project.featured);
      }
      
      return processedProjects;
    }
    return propProjects || [];
  }, [useDynamicData, dynamicProjects, propProjects, featuredOnly]);

  // Obtener listas únicas para filtros
  const filterOptions = useMemo(() => {
    const statuses = new Set(projectsData.map(project => project.status).filter(Boolean));
    const categories = new Set(projectsData.map(project => project.category).filter(Boolean));
    const researchLines = new Set(projectsData.map(project => project.researchLine).filter(Boolean));
    
    return {
      statuses: Array.from(statuses),
      categories: Array.from(categories),
      researchLines: Array.from(researchLines)
    };
  }, [projectsData]);

  // Filtrar proyectos
  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.principalInvestigator && project.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.tags && project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesResearchLine = selectedResearchLine === 'all' || project.researchLine === selectedResearchLine;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesResearchLine;
    });
  }, [projectsData, searchTerm, selectedStatus, selectedCategory, selectedResearchLine]);

  // Ordenar proyectos
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort((a, b) => {
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
        default: // updatedAt
          aValue = new Date(a.updatedAt || 0).getTime();
          bValue = new Date(b.updatedAt || 0).getTime();
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredProjects, sortBy, sortOrder]);

  // Aplicar límite si se especifica
  const displayedProjects = useMemo(() => {
    let projects = sortedProjects.slice(0, limit || visibleProjects);
    return projects;
  }, [sortedProjects, limit, visibleProjects]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    return getProjectsStats(dynamicProjects);
  }, [dynamicProjects]);

  const handleScroll = useCallback(() => {
    setShowScrollTop(window.scrollY > 300);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Si está cargando datos dinámicos, mostrar loading
  if (useDynamicData && isLoading) {
    return (
      <div className="h-auto bg-transparent p-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Proyectos de Investigación</h2>
          </div>
          
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600">Cargando proyectos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si hay error cargando datos dinámicos, no mostrar la sección
  if (useDynamicData && error) {
    return null;
  }

  const handleShowMore = () => {
    setVisibleProjects((prev) => prev + 6);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="h-auto bg-transparent p-6 pb-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header y Estadísticas */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {featuredOnly ? 'Proyectos Destacados' : 'Proyectos de Investigación'}
              </h2>
              <p className="text-gray-600 mt-2">
                {featuredOnly 
                  ? 'Los proyectos más relevantes de nuestro centro' 
                  : 'Gestión y líneas de investigación activas'
                }
              </p>
            </div>
            
            {!compact && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Estadísticas rápidas */}
          {showStats && !isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                    <p className="text-xs text-gray-600">Activos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
                    <p className="text-xs text-gray-600">Completados</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{stats.featured}</p>
                    <p className="text-xs text-gray-600">Destacados</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-teal-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-teal-600">{stats.averageProgress}%</p>
                    <p className="text-xs text-gray-600">Progreso Prom.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-indigo-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{stats.totalPublications}</p>
                    <p className="text-xs text-gray-600">Publicaciones</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtros y búsqueda */}
        {search && !compact && (
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              
              {/* Búsqueda */}
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por título, investigador o etiquetas..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtro de estado */}
              <div className="flex items-center space-x-2">
                <Filter className="text-gray-400 h-5 w-5" />
                <select
                  className="border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md flex-1"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  {filterOptions.statuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de categoría */}
              <div>
                <select
                  className="border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md w-full"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="all">Todas las categorías</option>
                  {filterOptions.categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filtros adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Línea de investigación */}
              <div>
                <select
                  className="border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md w-full"
                  value={selectedResearchLine}
                  onChange={(e) => setSelectedResearchLine(e.target.value)}
                >
                  <option value="all">Todas las líneas</option>
                  {filterOptions.researchLines.map((line) => (
                    <option key={line} value={line}>{line}</option>
                  ))}
                </select>
              </div>

              {/* Ordenamiento */}
              <div className="lg:col-span-3 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 py-2">Ordenar por:</span>
                {[
                  { key: 'updatedAt', label: 'Actualización' },
                  { key: 'priority', label: 'Prioridad' },
                  { key: 'progress', label: 'Progreso' },
                  { key: 'startDate', label: 'Fecha inicio' },
                  { key: 'publications', label: 'Publicaciones' }
                ].map((option) => (
                  <button
                    key={option.key}
                    onClick={() => toggleSort(option.key)}
                    className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
                      sortBy === option.key 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    {sortBy === option.key && (
                      sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid de proyectos */}
        <div className={`${viewMode === 'grid' 
          ? `grid grid-cols-1 ${compact ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6` 
          : 'space-y-6'
        }`}>
          {displayedProjects.map((project) => (
            <ResearchProjectCard 
              key={project.id} 
              {...project} 
              compact={compact || viewMode === 'list'}
            />
          ))}
        </div>

        {/* Mensaje si no hay proyectos */}
        {displayedProjects.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proyectos</h3>
            <p className="text-gray-500">
              {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedResearchLine !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay proyectos disponibles en este momento'
              }
            </p>
          </div>
        )}

        {/* Botón Ver más */}
        {!limit && visibleProjects < sortedProjects.length && (
          <div className="mt-8 text-center">
            <button
              onClick={handleShowMore}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Cargar más proyectos ({sortedProjects.length - visibleProjects} restantes)
            </button>
          </div>
        )}

        {/* Botón Scroll to Top */}
        {showScrollTop && <TopScroll />}
      </div>
    </div>
  );
};

export default ResearchProjects;