'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  Star,
  User,
  Clock,
  Image,
  Video,
  FileText,
  Music,
  Download,
  ExternalLink
} from 'lucide-react'
import { useMediaGallery, MediaGalleryItem, MediaType, getMediaTypeLabel, formatFileSize } from '@/hooks/useMediaGallery'
import AddMediaModal from './components/AddMediaModal'
import EditMediaModal from './components/EditMediaModal'

export default function MediaGalleryManagement() {
  const router = useRouter()
  const {
    mediaItems,
    isLoading,
    error,
    stats,
    availableCategories,
    availableCollections,
    fetchMediaGallery,
    deleteMediaItem
  } = useMediaGallery()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMedia, setEditingMedia] = useState<MediaGalleryItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<MediaType | ''>('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all')

  useEffect(() => {
    // Aplicar filtros cuando cambien
    const filters = {
      search: searchTerm,
      type: filterType,
      category: filterCategory,
      published: filterStatus === 'all' ? null : filterStatus === 'published',
      featured: filterFeatured === 'all' ? null : filterFeatured === 'featured'
    }
    fetchMediaGallery(filters)
  }, [searchTerm, filterType, filterCategory, filterStatus, filterFeatured, fetchMediaGallery])

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este elemento multimedia?')) {
      return
    }

    const result = await deleteMediaItem(id)
    if (!result.success) {
      console.error('Error deleting media:', result.error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleEditMedia = (mediaItem: MediaGalleryItem) => {
    setEditingMedia(mediaItem)
    setShowEditModal(true)
  }

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="h-5 w-5" />
      case 'VIDEO':
        return <Video className="h-5 w-5" />
      case 'DOCUMENT':
        return <FileText className="h-5 w-5" />
      case 'AUDIO':
        return <Music className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/admin/content')}
                  className="mr-4 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Galería de Medios
                  </h1>
                  <p className="text-gray-600">Administrar imágenes, videos y recursos multimedia</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Elementos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Image className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Imágenes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.byType?.image || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Video className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Videos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.byType?.video || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Documentos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.byType?.document || 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Music className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Audio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats?.byType?.audio || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar en galería..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Type Filter */}
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as MediaType | '')}
                >
                  <option value="">Todos los tipos</option>
                  <option value="IMAGE">Imágenes</option>
                  <option value="VIDEO">Videos</option>
                  <option value="DOCUMENT">Documentos</option>
                  <option value="AUDIO">Audio</option>
                </select>

                {/* Category Filter */}
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">Todos</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Borradores</option>
                </select>

                {/* Featured Filter */}
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value as any)}
                >
                  <option value="all">Todos</option>
                  <option value="featured">Destacados</option>
                  <option value="regular">Regulares</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Elemento
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Media Gallery List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Elementos Multimedia ({mediaItems.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="ml-3 text-gray-600">Cargando galería...</p>
              </div>
            ) : mediaItems.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {mediaItems.map((mediaItem) => (
                  <div key={mediaItem.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {/* Thumbnail/Preview */}
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {mediaItem.thumbnailUrl || (mediaItem.type === 'IMAGE' && mediaItem.fileUrl) ? (
                              <img 
                                src={mediaItem.thumbnailUrl || mediaItem.fileUrl} 
                                alt={mediaItem.alt || mediaItem.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-gray-400">
                                {getMediaIcon(mediaItem.type)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-lg font-medium text-gray-900">{mediaItem.title}</h4>
                              {mediaItem.featured && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                mediaItem.published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {mediaItem.published ? 'Publicado' : 'Borrador'}
                              </span>
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {getMediaTypeLabel(mediaItem.type)}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{mediaItem.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500 flex-wrap">
                          {mediaItem.author && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              <span>{mediaItem.author}</span>
                            </div>
                          )}
                          {mediaItem.fileSize && (
                            <div className="flex items-center">
                              <span>{formatFileSize(mediaItem.fileSize)}</span>
                            </div>
                          )}
                          {mediaItem.category && (
                            <div className="flex items-center">
                              <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">{mediaItem.category}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(mediaItem.createdAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{mediaItem.views} vistas</span>
                          </div>
                          {mediaItem.downloads > 0 && (
                            <div className="flex items-center">
                              <Download className="h-4 w-4 mr-1" />
                              <span>{mediaItem.downloads} descargas</span>
                            </div>
                          )}
                          {mediaItem.tags.length > 0 && (
                            <div className="flex items-center flex-wrap gap-1">
                              {mediaItem.tags.slice(0, 3).map((tag, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                              {mediaItem.tags.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{mediaItem.tags.length - 3} más
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => window.open(mediaItem.fileUrl, '_blank')}
                          className="p-2 text-gray-400 hover:text-blue-600"
                          title="Ver archivo"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditMedia(mediaItem)}
                          className="p-2 text-gray-400 hover:text-yellow-600"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMedia(mediaItem.id)}
                          className="p-2 text-gray-400 hover:text-red-600"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Image className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay elementos multimedia</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterType || filterCategory || filterStatus !== 'all' || filterFeatured !== 'all'
                    ? 'No se encontraron elementos con los filtros aplicados.'
                    : 'Comienza agregando tu primer elemento multimedia.'
                  }
                </p>
                {!searchTerm && !filterType && !filterCategory && filterStatus === 'all' && filterFeatured === 'all' && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Elemento
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddMediaModal 
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false)
              fetchMediaGallery()
            }}
          />
        )}

        {showEditModal && editingMedia && (
          <EditMediaModal 
            mediaItem={editingMedia}
            onClose={() => {
              setShowEditModal(false)
              setEditingMedia(null)
            }}
            onSuccess={() => {
              setShowEditModal(false)
              setEditingMedia(null)
              fetchMediaGallery()
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}