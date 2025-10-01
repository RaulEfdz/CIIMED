'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Music,
  Download,
  Eye,
  Calendar,
  User,
  ExternalLink,
  ChevronDown,
  Grid,
  List
} from 'lucide-react'
import { useMediaGallery, MediaGalleryItem, MediaType, getMediaTypeLabel, formatFileSize, formatDuration } from '@/hooks/useMediaGallery'

export default function MediaGalleryPage() {
  const {
    mediaItems,
    isLoading,
    error,
    stats,
    availableCategories,
    availableCollections,
    fetchMediaGallery,
    trackDownload
  } = useMediaGallery()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<MediaType | ''>('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterCollection, setFilterCollection] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItem, setSelectedItem] = useState<MediaGalleryItem | null>(null)

  useEffect(() => {
    // Aplicar filtros cuando cambien
    const filters = {
      search: searchTerm,
      type: filterType,
      category: filterCategory,
      collection: filterCollection,
      published: true // Solo mostrar elementos publicados
    }
    fetchMediaGallery(filters)
  }, [searchTerm, filterType, filterCategory, filterCollection, fetchMediaGallery])

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'IMAGE':
        return <ImageIcon className="h-5 w-5" />
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

  const handleDownload = async (item: MediaGalleryItem) => {
    if (!item.allowDownload) return
    
    try {
      // Rastrear descarga
      await trackDownload(item.id)
      
      // Abrir archivo en nueva ventana para descarga
      window.open(item.fileUrl, '_blank')
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const MediaCard = ({ item }: { item: MediaGalleryItem }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Thumbnail/Preview */}
      <div className="aspect-video bg-gray-200 relative overflow-hidden">
        {item.thumbnailUrl || (item.type === 'IMAGE' && item.fileUrl) ? (
          <img 
            src={item.thumbnailUrl || item.fileUrl} 
            alt={item.alt || item.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setSelectedItem(item)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 cursor-pointer"
               onClick={() => setSelectedItem(item)}>
            {getMediaIcon(item.type)}
            <span className="ml-2 text-sm">{getMediaTypeLabel(item.type)}</span>
          </div>
        )}
        
        {/* Overlay con tipo de archivo */}
        <div className="absolute top-2 left-2">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
            {getMediaIcon(item.type)}
            <span className="ml-1">{getMediaTypeLabel(item.type)}</span>
          </span>
        </div>

        {/* Featured badge */}
        {item.featured && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              Destacado
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.description}</p>
        
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            {item.author && (
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                <span>{item.author}</span>
              </div>
            )}
            {item.fileSize && (
              <span>{formatFileSize(item.fileSize)}</span>
            )}
            {item.duration && (
              <span>{formatDuration(item.duration)}</span>
            )}
          </div>
          <div className="flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            <span>{item.views}</span>
          </div>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-gray-500 text-xs">+{item.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedItem(item)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </button>
          {item.allowDownload && (
            <button
              onClick={() => handleDownload(item)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar
            </button>
          )}
          {item.externalUrl && (
            <button
              onClick={() => window.open(item.externalUrl, '_blank')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm flex items-center justify-center"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const MediaListItem = ({ item }: { item: MediaGalleryItem }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start space-x-4">
        {/* Thumbnail */}
        <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
          {item.thumbnailUrl || (item.type === 'IMAGE' && item.fileUrl) ? (
            <img 
              src={item.thumbnailUrl || item.fileUrl} 
              alt={item.alt || item.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setSelectedItem(item)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 cursor-pointer"
                 onClick={() => setSelectedItem(item)}>
              {getMediaIcon(item.type)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  {getMediaIcon(item.type)}
                  <span className="ml-1">{getMediaTypeLabel(item.type)}</span>
                </span>
                {item.author && (
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {item.author}
                  </span>
                )}
                {item.fileSize && <span>{formatFileSize(item.fileSize)}</span>}
                <span className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  {item.views}
                </span>
                <span>{formatDate(item.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => setSelectedItem(item)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <Eye className="h-3 w-3 mr-1" />
                Ver
              </button>
              {item.allowDownload && (
                <button
                  onClick={() => handleDownload(item)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Descargar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Galería de Medios</h1>
          <p className="text-gray-600">Explora nuestros recursos multimedia: imágenes, videos, documentos y archivos de audio</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.byType?.image || 0}</div>
              <div className="text-sm text-gray-600">Imágenes</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-red-600">{stats.byType?.video || 0}</div>
              <div className="text-sm text-gray-600">Videos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">{stats.byType?.document || 0}</div>
              <div className="text-sm text-gray-600">Documentos</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.byType?.audio || 0}</div>
              <div className="text-sm text-gray-600">Audio</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar en la galería..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Quick filters */}
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as MediaType | '')}
              >
                <option value="">Todos los tipos</option>
                <option value="IMAGE">Imágenes</option>
                <option value="VIDEO">Videos</option>
                <option value="DOCUMENT">Documentos</option>
                <option value="AUDIO">Audio</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                <ChevronDown className={`h-4 w-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="">Todas las categorías</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Colección</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterCollection}
                    onChange={(e) => setFilterCollection(e.target.value)}
                  >
                    <option value="">Todas las colecciones</option>
                    {availableCollections.map((collection) => (
                      <option key={collection} value={collection}>{collection}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
            <div className="text-red-800">
              <p>Error al cargar la galería: {error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600">Cargando galería...</p>
          </div>
        )}

        {/* Media Grid/List */}
        {!isLoading && !error && (
          <>
            {mediaItems.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {mediaItems.map((item) => (
                  viewMode === 'grid' ? (
                    <MediaCard key={item.id} item={item} />
                  ) : (
                    <MediaListItem key={item.id} item={item} />
                  )
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay elementos multimedia</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterType || filterCategory || filterCollection
                    ? 'No se encontraron elementos con los filtros aplicados.'
                    : 'Aún no hay elementos en la galería.'
                  }
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal para ver elemento */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedItem.title}</h2>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              {/* Media display */}
              <div className="mb-4">
                {selectedItem.type === 'IMAGE' ? (
                  <img 
                    src={selectedItem.fileUrl} 
                    alt={selectedItem.alt || selectedItem.title}
                    className="w-full max-h-96 object-contain rounded"
                  />
                ) : selectedItem.type === 'VIDEO' ? (
                  <video 
                    controls 
                    className="w-full max-h-96 rounded"
                    poster={selectedItem.thumbnailUrl}
                  >
                    <source src={selectedItem.fileUrl} />
                    Tu navegador no soporta el elemento de video.
                  </video>
                ) : selectedItem.type === 'AUDIO' ? (
                  <audio controls className="w-full">
                    <source src={selectedItem.fileUrl} />
                    Tu navegador no soporta el elemento de audio.
                  </audio>
                ) : (
                  <div className="bg-gray-100 p-8 text-center rounded">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">Documento: {selectedItem.fileName}</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <p className="text-gray-700">{selectedItem.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedItem.author && (
                    <div>
                      <span className="font-medium text-gray-900">Autor:</span>
                      <span className="ml-2 text-gray-600">{selectedItem.author}</span>
                    </div>
                  )}
                  {selectedItem.fileSize && (
                    <div>
                      <span className="font-medium text-gray-900">Tamaño:</span>
                      <span className="ml-2 text-gray-600">{formatFileSize(selectedItem.fileSize)}</span>
                    </div>
                  )}
                  {selectedItem.location && (
                    <div>
                      <span className="font-medium text-gray-900">Ubicación:</span>
                      <span className="ml-2 text-gray-600">{selectedItem.location}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-900">Fecha:</span>
                    <span className="ml-2 text-gray-600">{formatDate(selectedItem.createdAt)}</span>
                  </div>
                </div>

                {selectedItem.tags.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-900">Etiquetas:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedItem.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  {selectedItem.allowDownload && (
                    <button
                      onClick={() => handleDownload(selectedItem)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </button>
                  )}
                  {selectedItem.externalUrl && (
                    <button
                      onClick={() => window.open(selectedItem.externalUrl, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Enlace externo
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}