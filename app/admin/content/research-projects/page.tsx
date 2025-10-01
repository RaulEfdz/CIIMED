'use client'

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Target, 
  TrendingUp, 
  Users, 
  Award,
  DollarSign,
  Calendar,
  Settings,
  MoreVertical,
  Star,
  Play,
  Pause,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useResearchProjects, getProjectStatus, formatBudget } from '@/hooks/useResearchProjects';
import AddResearchProjectModal from './components/AddResearchProjectModal';
import EditResearchProjectModal from './components/EditResearchProjectModal';
import { getProjectsStats } from '@/app/data/research-projects';

export default function ResearchProjectsAdminPage() {
  const { projects, isLoading, error, fetchProjects, deleteProject, batchUpdate } = useResearchProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  useEffect(() => {
    fetchProjects({ published: undefined }); // Mostrar todos los proyectos en admin
  }, [fetchProjects]);

  // Filtrar proyectos
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.principalInvestigator && project.principalInvestigator.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Paginación
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const startIndex = (currentPage - 1) * projectsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + projectsPerPage);

  // Obtener opciones únicas para filtros
  const statusOptions = [...new Set(projects.map(p => p.status))];
  const categoryOptions = [...new Set(projects.map(p => p.category).filter(Boolean))];

  // Estadísticas
  const stats = getProjectsStats(projects);

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      const result = await deleteProject(projectId);
      if (result.success) {
        alert('Proyecto eliminado exitosamente');
      } else {
        alert(`Error: ${result.error}`);
      }
    }
  };

  const handleBatchAction = async (action: string) => {
    if (selectedProjects.size === 0) {
      alert('Por favor selecciona al menos un proyecto');
      return;
    }

    const projectIds = Array.from(selectedProjects);
    let result;

    switch (action) {
      case 'delete':
        if (window.confirm(`¿Estás seguro de que quieres eliminar ${projectIds.length} proyecto(s)?`)) {
          // Implementar eliminación masiva
          for (const id of projectIds) {
            await deleteProject(id);
          }
          setSelectedProjects(new Set());
        }
        break;
      case 'feature':
        result = await batchUpdate('toggleFeatured', projectIds);
        if (result.success) {
          alert(`${result.updatedCount} proyecto(s) actualizado(s)`);
          setSelectedProjects(new Set());
          fetchProjects({ published: undefined });
        }
        break;
      case 'publish':
        result = await batchUpdate('togglePublished', projectIds);
        if (result.success) {
          alert(`${result.updatedCount} proyecto(s) actualizado(s)`);
          setSelectedProjects(new Set());
          fetchProjects({ published: undefined });
        }
        break;
      case 'activate':
        result = await batchUpdate('updateStatus', projectIds, { status: 'active' });
        if (result.success) {
          alert(`${result.updatedCount} proyecto(s) activado(s)`);
          setSelectedProjects(new Set());
          fetchProjects({ published: undefined });
        }
        break;
    }
  };

  const toggleProjectSelection = (projectId: string) => {
    const newSelection = new Set(selectedProjects);
    if (newSelection.has(projectId)) {
      newSelection.delete(projectId);
    } else {
      newSelection.add(projectId);
    }
    setSelectedProjects(newSelection);
  };

  const selectAllProjects = () => {
    if (selectedProjects.size === paginatedProjects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(paginatedProjects.map(p => p.id)));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Target className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Proyectos de Investigación</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Target className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Proyectos de Investigación</h1>
            <p className="text-gray-600">Gestiona las líneas de investigación y proyectos activos</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Award className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Destacados</p>
              <p className="text-2xl font-bold text-orange-600">{stats.featured}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-teal-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Progreso Prom.</p>
              <p className="text-2xl font-bold text-teal-600">{stats.averageProgress}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Publicaciones</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalPublications}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-md border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar proyectos por título, descripción o investigador..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="text-gray-400 h-5 w-5" />
            <select
              className="border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md flex-1"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {getProjectStatus(status).label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md w-full"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas las categorías</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Acciones masivas */}
        {selectedProjects.size > 0 && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-md p-3">
            <span className="text-blue-800 font-medium">
              {selectedProjects.size} proyecto(s) seleccionado(s)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBatchAction('feature')}
                className="px-3 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700"
              >
                <Star className="h-4 w-4 mr-1 inline" />
                Destacar
              </button>
              <button
                onClick={() => handleBatchAction('publish')}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                <Eye className="h-4 w-4 mr-1 inline" />
                Publicar
              </button>
              <button
                onClick={() => handleBatchAction('activate')}
                className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-1 inline" />
                Activar
              </button>
              <button
                onClick={() => handleBatchAction('delete')}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-1 inline" />
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de proyectos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProjects.size === paginatedProjects.length && paginatedProjects.length > 0}
                    onChange={selectAllProjects}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyecto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Investigador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progreso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProjects.map((project) => {
                const statusInfo = getProjectStatus(project.status);
                return (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedProjects.has(project.id)}
                        onChange={() => toggleProjectSelection(project.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        {project.imageUrl && (
                          <img 
                            src={project.imageUrl} 
                            alt={project.title}
                            className="h-12 w-12 rounded-md object-cover mr-3"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-sm font-medium text-gray-900">{project.title}</h3>
                            {project.featured && (
                              <Star className="h-4 w-4 text-yellow-500 ml-2" />
                            )}
                            {!project.published && (
                              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 rounded-sm text-xs">
                                Borrador
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">{project.description}</p>
                          {project.category && (
                            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-sm text-xs">
                              {project.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-sm text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.principalInvestigator || 'No asignado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 mr-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${project.currentProgress}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">{project.currentProgress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.budget ? formatBudget(project.budget, project.currency) : 'No especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + projectsPerPage, filteredProjects.length)}
                  </span>{' '}
                  de <span className="font-medium">{filteredProjects.length}</span> proyectos
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mensaje si no hay proyectos */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron proyectos</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primer proyecto de investigación'
            }
          </p>
          {(!searchTerm && selectedStatus === 'all' && selectedCategory === 'all') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center mx-auto"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agregar Primer Proyecto
            </button>
          )}
        </div>
      )}

      {/* Modales */}
      {showAddModal && (
        <AddResearchProjectModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchProjects({ published: undefined });
          }}
        />
      )}

      {showEditModal && editingProject && (
        <EditResearchProjectModal 
          project={editingProject}
          onClose={() => {
            setShowEditModal(false);
            setEditingProject(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setEditingProject(null);
            fetchProjects({ published: undefined });
          }}
        />
      )}
    </div>
  );
}