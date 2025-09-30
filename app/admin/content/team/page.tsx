'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  UserCheck,
  Building2,
  Mail,
  Phone,
  Upload,
  Linkedin,
  Globe
} from 'lucide-react'

import { TeamMember } from './components/types'
import AddMemberModal from './components/AddMemberModal'
import EditMemberModal from './components/EditMemberModal'
import ImportModal from './components/ImportModal'

export default function TeamManagement() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team?includeInactive=true')
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error ${response.status}:`, errorText)
        throw new Error(`Failed to fetch team members: ${response.status} "${response.statusText}"`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data && data.teamMembers && Array.isArray(data.teamMembers)) {
        const convertedMembers = data.teamMembers.map((member: any) => ({
          id: member.id || '',
          name: member.name || 'Sin nombre',
          position: member.position || 'Sin posición',
          department: member.department || 'Sin departamento',
          email: member.email || '',
          phone: member.phone || '',
          bio: member.bio || '',
          avatar: member.avatar || '',
          linkedIn: member.linkedIn || '',
          website: member.website || '',
          specialties: Array.isArray(member.specialties) ? member.specialties : [],
          status: member.status ? member.status.toLowerCase() : 'active',
          joinDate: member.createdAt || new Date().toISOString(),
          type: member.type ? member.type.toLowerCase() : 'staff'
        }))
        setTeamMembers(convertedMembers)
      } else {
        console.log('No team members found in API response')
        setTeamMembers([])
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
      setTeamMembers([])
    } finally {
      setIsLoading(false)
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

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member)
    setShowEditModal(true)
  }

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar a ${memberName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/team/${memberId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchTeamMembers()
      } else {
        const error = await response.json()
        console.error('Error deleting member:', error.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error deleting member:', error)
    }
  }

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || member.type === filterType
    
    return matchesSearch && matchesFilter
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'director': return 'bg-purple-100 text-purple-800'
      case 'researcher': return 'bg-blue-100 text-blue-800'
      case 'staff': return 'bg-green-100 text-green-800'
      case 'admin': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'director': return 'Director'
      case 'researcher': return 'Investigador'
      case 'staff': return 'Personal'
      case 'admin': return 'Administrativo'
      default: return 'Otro'
    }
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
                    Gestión del Equipo de Trabajo
                  </h1>
                  <p className="text-gray-600">Administra el personal, investigadores y directivos del CIIMED</p>
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
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Personal</p>
                  <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Investigadores</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.filter(m => m.type === 'researcher' || m.type === 'director').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Departamentos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(teamMembers.map(m => m.department)).size}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Activos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamMembers.filter(m => m.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Miembro
              </button>
              
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Masivo
              </button>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="all">Todos los tipos</option>
                <option value="director">Directores</option>
                <option value="researcher">Investigadores</option>
                <option value="staff">Personal</option>
                <option value="admin">Administrativos</option>
              </select>
            </div>

            <div className="flex items-center">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar miembros..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border border-gray-300 rounded-md px-3 py-2 text-sm w-64"
                />
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Miembros del Equipo ({filteredMembers.length})
              </h3>
            </div>
            
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando equipo...</p>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                {searchTerm ? 'No se encontraron miembros' : 'No hay miembros del equipo aún'}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                            {member.avatar ? (
                              <img 
                                src={member.avatar} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Users className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.position}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(member.type)}`}>
                            {getTypeLabel(member.type)}
                          </span>
                        </div>
                        
                        <div className="ml-15 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building2 className="h-4 w-4 mr-2" />
                            <span>{member.department}</span>
                          </div>
                          
                          {member.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <span>{member.email}</span>
                            </div>
                          )}
                          
                          {member.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                          
                          {member.linkedIn && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Linkedin className="h-4 w-4 mr-2" />
                              <a 
                                href={member.linkedIn} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                LinkedIn
                              </a>
                            </div>
                          )}
                          
                          {member.website && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Globe className="h-4 w-4 mr-2" />
                              <a 
                                href={member.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Sitio Web
                              </a>
                            </div>
                          )}
                          
                          {member.specialties.length > 0 && (
                            <div className="flex items-center flex-wrap gap-1 mt-2">
                              {member.specialties.map((specialty, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button 
                          className="text-gray-400 hover:text-blue-600"
                          title="Ver perfil completo"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditMember(member)}
                          className="text-gray-400 hover:text-green-600"
                          title="Editar miembro"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          className="text-gray-400 hover:text-red-600"
                          title="Eliminar miembro"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coming Soon Notice */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-blue-900">
                  🚧 Gestión del Equipo en Desarrollo
                </h3>
                <p className="text-blue-700 mt-1">
                  Esta sección está siendo desarrollada. Próximamente podrás:
                </p>
                <ul className="mt-2 text-blue-700 text-sm space-y-1">
                  <li>• <strong>Agregar nuevos miembros</strong> con fotos y biografías completas</li>
                  <li>• <strong>Editar perfiles</strong> y actualizar información del personal</li>
                  <li>• <strong>Gestionar especialidades</strong> y áreas de investigación</li>
                  <li>• <strong>Organizar por departamentos</strong> y roles jerárquicos</li>
                  <li>• <strong>Exportar directorios</strong> y generar reportes del equipo</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddMemberModal 
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              setShowAddModal(false)
              fetchTeamMembers()
            }}
            setTeamMembers={setTeamMembers}
          />
        )}

        {showImportModal && (
          <ImportModal 
            onClose={() => setShowImportModal(false)}
            onSuccess={() => {
              setShowImportModal(false)
              fetchTeamMembers()
            }}
          />
        )}

        {showEditModal && editingMember && (
          <EditMemberModal 
            member={editingMember}
            onClose={() => {
              setShowEditModal(false)
              setEditingMember(null)
            }}
            onSuccess={() => {
              setShowEditModal(false)
              setEditingMember(null)
              fetchTeamMembers()
            }}
            setTeamMembers={setTeamMembers}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}