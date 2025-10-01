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
  Clock
} from 'lucide-react'
import { News } from '@/hooks/useNews'
import AddNewsModal from './components/AddNewsModal'
import EditNewsModal from './components/EditNewsModal'

export default function NewsManagement() {
  const router = useRouter()
  const [news, setNews] = useState<News[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingNews, setEditingNews] = useState<News | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/news?includeUnpublished=true')
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error ${response.status}:`, errorText)
        throw new Error(`Failed to fetch news: ${response.status} "${response.statusText}"`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.success && Array.isArray(data.news)) {
        setNews(data.news)
      } else {
        console.log('No news found in API response')
        setNews([])
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      setNews([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteNews = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      return
    }

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchNews()
      } else {
        const error = await response.json()
        console.error('Error deleting news:', error.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error deleting news:', error)
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

  const handleEditNews = (newsItem: News) => {
    setEditingNews(newsItem)
    setShowEditModal(true)
  }

  // Filtrar noticias
  const filteredNews = news.filter(newsItem => {
    const matchesSearch = 
      newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsItem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsItem.author.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'published' && newsItem.published) ||
      (filterStatus === 'draft' && !newsItem.published)
    
    const matchesFeatured = 
      filterFeatured === 'all' ||
      (filterFeatured === 'featured' && newsItem.featured) ||
      (filterFeatured === 'regular' && !newsItem.featured)
    
    return matchesSearch && matchesStatus && matchesFeatured
  })

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
                    Gestión de Noticias
                  </h1>
                  <p className="text-gray-600">Administrar artículos, noticias y comunicados</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Noticias</p>
                  <p className="text-2xl font-bold text-gray-900">{news.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Publicadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {news.filter(n => n.published).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Destacadas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {news.filter(n => n.featured).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Edit className="h-8 w-8 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Borradores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {news.filter(n => !n.published).length}
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
                    placeholder="Buscar noticias..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">Todas</option>
                  <option value="published">Publicadas</option>
                  <option value="draft">Borradores</option>
                </select>

                {/* Featured Filter */}
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value as any)}
                >
                  <option value="all">Todas</option>
                  <option value="featured">Destacadas</option>
                  <option value="regular">Regulares</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Noticia
              </button>
            </div>
          </div>

          {/* News List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Noticias ({filteredNews.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <p className="ml-3 text-gray-600">Cargando noticias...</p>
              </div>
            ) : filteredNews.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredNews.map((newsItem) => (
                  <div key={newsItem.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {newsItem.imageUrl && (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={newsItem.imageUrl} 
                                alt={newsItem.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-lg font-medium text-gray-900">{newsItem.title}</h4>
                              {newsItem.featured && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                newsItem.published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {newsItem.published ? 'Publicada' : 'Borrador'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{newsItem.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{newsItem.author}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{newsItem.readTime}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(newsItem.publishedAt)}</span>
                          </div>
                          {newsItem.tags.length > 0 && (
                            <div className="flex items-center flex-wrap gap-1">
                              {newsItem.tags.map((tag, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {newsItem.link && (
                          <button
                            onClick={() => window.open(newsItem.link, '_blank')}
                            className="p-2 text-gray-400 hover:text-blue-600"
                            title="Ver noticia"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditNews(newsItem)}
                          className="p-2 text-gray-400 hover:text-yellow-600"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNews(newsItem.id)}
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
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay noticias</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterFeatured !== 'all'
                    ? 'No se encontraron noticias con los filtros aplicados.'
                    : 'Comienza creando tu primera noticia.'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && filterFeatured === 'all' && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Noticia
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddNewsModal 
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false)
              fetchNews()
            }}
            setNews={setNews}
          />
        )}

        {showEditModal && editingNews && (
          <EditNewsModal 
            news={editingNews}
            onClose={() => {
              setShowEditModal(false)
              setEditingNews(null)
            }}
            onSuccess={() => {
              setShowEditModal(false)
              setEditingNews(null)
              fetchNews()
            }}
            setNews={setNews}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}