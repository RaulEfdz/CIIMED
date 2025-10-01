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
  Calendar,
  Star,
  MapPin,
  Clock,
  Users,
  DollarSign
} from 'lucide-react'
import { Event } from '@/hooks/useEvents'
import AddEventModal from './components/AddEventModal'
import EditEventModal from './components/EditEventModal'

export default function EventsManagement() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [filterFeatured, setFilterFeatured] = useState<'all' | 'featured' | 'regular'>('all')
  const [filterTime, setFilterTime] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/events?includeUnpublished=true')
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error ${response.status}:`, errorText)
        throw new Error(`Failed to fetch events: ${response.status} "${response.statusText}"`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events)
      } else {
        console.log('No events found in API response')
        setEvents([])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchEvents()
      } else {
        const error = await response.json()
        console.error('Error deleting event:', error.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
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

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowEditModal(true)
  }

  // Filtrar eventos
  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.speaker && event.speaker.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'published' && event.published) ||
      (filterStatus === 'draft' && !event.published)
    
    const matchesFeatured = 
      filterFeatured === 'all' ||
      (filterFeatured === 'featured' && event.featured) ||
      (filterFeatured === 'regular' && !event.featured)
    
    const now = new Date()
    const eventDate = new Date(event.eventDate)
    const matchesTime = 
      filterTime === 'all' ||
      (filterTime === 'upcoming' && eventDate >= now) ||
      (filterTime === 'past' && eventDate < now)
    
    return matchesSearch && matchesStatus && matchesFeatured && matchesTime
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) >= new Date()
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
                    Gestión de Eventos
                  </h1>
                  <p className="text-gray-600">Administrar workshops, conferencias y actividades</p>
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
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Calendar className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Eventos</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Próximos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.filter(e => isUpcoming(e.eventDate)).length}
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
                  <p className="text-sm font-medium text-gray-600">Destacados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.filter(e => e.featured).length}
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
                    {events.filter(e => !e.published).length}
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
                    placeholder="Buscar eventos..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                >
                  <option value="all">Todos</option>
                  <option value="published">Publicados</option>
                  <option value="draft">Borradores</option>
                </select>

                {/* Featured Filter */}
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filterFeatured}
                  onChange={(e) => setFilterFeatured(e.target.value as any)}
                >
                  <option value="all">Todos</option>
                  <option value="featured">Destacados</option>
                  <option value="regular">Regulares</option>
                </select>

                {/* Time Filter */}
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={filterTime}
                  onChange={(e) => setFilterTime(e.target.value as any)}
                >
                  <option value="all">Todos</option>
                  <option value="upcoming">Próximos</option>
                  <option value="past">Pasados</option>
                </select>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Evento
              </button>
            </div>
          </div>

          {/* Events List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Eventos ({filteredEvents.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="ml-3 text-gray-600">Cargando eventos...</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <div key={event.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {event.imageUrl && (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={event.imageUrl} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                              {event.featured && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                event.published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {event.published ? 'Publicado' : 'Borrador'}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                isUpcoming(event.eventDate)
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {isUpcoming(event.eventDate) ? 'Próximo' : 'Pasado'}
                              </span>
                              {event.category && (
                                <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                                  {event.category}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{event.location}</span>
                          </div>
                          {event.speaker && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{event.speaker}</span>
                            </div>
                          )}
                          {event.capacity && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>Cap: {event.capacity}</span>
                            </div>
                          )}
                          {event.price !== null && event.price !== undefined && (
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              <span>
                                {event.price === 0 ? 'Gratuito' : `${event.price} ${event.currency}`}
                              </span>
                            </div>
                          )}
                          {event.tags.length > 0 && (
                            <div className="flex items-center flex-wrap gap-1 col-span-full">
                              {event.tags.map((tag, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        {event.link && (
                          <button
                            onClick={() => window.open(event.link, '_blank')}
                            className="p-2 text-gray-400 hover:text-blue-600"
                            title="Ver evento"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-gray-400 hover:text-yellow-600"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay eventos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterStatus !== 'all' || filterFeatured !== 'all' || filterTime !== 'all'
                    ? 'No se encontraron eventos con los filtros aplicados.'
                    : 'Comienza creando tu primer evento.'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && filterFeatured === 'all' && filterTime === 'all' && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Evento
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddEventModal 
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false)
              fetchEvents()
            }}
            setEvents={setEvents}
          />
        )}

        {showEditModal && editingEvent && (
          <EditEventModal 
            event={editingEvent}
            onClose={() => {
              setShowEditModal(false)
              setEditingEvent(null)
            }}
            onSuccess={() => {
              setShowEditModal(false)
              setEditingEvent(null)
              fetchEvents()
            }}
            setEvents={setEvents}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}