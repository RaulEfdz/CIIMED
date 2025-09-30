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
  Download
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  position: string
  department: string
  email?: string
  phone?: string
  bio?: string
  avatar?: string
  specialties: string[]
  status: 'active' | 'inactive'
  joinDate: string
  type: 'researcher' | 'staff' | 'director' | 'admin'
}

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
      
      // Verificar que existan los datos esperados
      if (data && data.teamMembers && Array.isArray(data.teamMembers)) {
        // Convertir formato de la API al formato del componente
        const convertedMembers = data.teamMembers.map((member: any) => ({
          id: member.id || '',
          name: member.name || 'Sin nombre',
          position: member.position || 'Sin posición',
          department: member.department || 'Sin departamento',
          email: member.email || '',
          phone: member.phone || '',
          bio: member.bio || '',
          avatar: member.avatar || '',
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

        {/* Add Member Modal */}
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

        {/* Import Modal */}
        {showImportModal && (
          <ImportModal 
            onClose={() => setShowImportModal(false)}
            onSuccess={() => {
              setShowImportModal(false)
              fetchTeamMembers()
            }}
          />
        )}

        {/* Edit Modal */}
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

function AddMemberModal({ 
  onClose, 
  onSuccess,
  setTeamMembers
}: { 
  onClose: () => void
  onSuccess: () => void
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>
}) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    bio: '',
    linkedIn: '',
    website: '',
    specialties: '',
    type: 'STAFF',
    avatar: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Usar el helper de UploadThing
      const { uploadFiles } = await import('@/lib/useUpload')
      
      const result = await uploadFiles('teamAvatars', {
        files: [file]
      })
      
      console.log('Upload result:', result)
      
      if (result && result.length > 0) {
        const file = result[0]
        console.log('File object:', file)
        console.log('Available file properties:', Object.keys(file))
        
        // Construir URL desde el key de UploadThing
        if (file.key) {
          const uploadThingUrl = `https://utfs.io/f/${file.key}`
          console.log('Constructed URL:', uploadThingUrl)
          return uploadThingUrl
        } else if (file.url) {
          return file.url
        } else {
          console.error('No key or URL found in upload result')
          throw new Error('No se recibió URL de la imagen subida')
        }
      } else {
        throw new Error('No se recibió resultado de la subida')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.position || !formData.department) {
      return
    }

    setIsSubmitting(true)
    try {
      let avatarUrl = formData.avatar
      
      // Subir imagen si se seleccionó una
      if (selectedFile) {
        avatarUrl = await uploadImage(selectedFile)
      }

      const response = await fetch('/api/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl,
          specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Actualizar inmediatamente el estado local con el nuevo miembro
        if (result.teamMember) {
          const newMember = {
            id: result.teamMember.id,
            name: result.teamMember.name || 'Sin nombre',
            position: result.teamMember.position || 'Sin posición',
            department: result.teamMember.department || 'Sin departamento',
            email: result.teamMember.email || '',
            phone: result.teamMember.phone || '',
            bio: result.teamMember.bio || '',
            avatar: avatarUrl || '',
            specialties: result.teamMember.specialties || [],
            status: result.teamMember.status ? result.teamMember.status.toLowerCase() : 'active',
            joinDate: result.teamMember.createdAt || new Date().toISOString(),
            type: result.teamMember.type ? result.teamMember.type.toLowerCase() : 'staff'
          }
          setTeamMembers(prev => [...prev, newMember])
        }
        
        onSuccess()
      } else {
        const error = await response.json()
        console.error('Error adding member:', error.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error adding member:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Agregar Nuevo Miembro del Equipo</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto del miembro
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Users className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  Formatos: JPG, PNG, GIF. Máximo 4MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Dr. Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posición *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Investigador Senior"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Investigación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="DIRECTOR">Director</option>
                <option value="RESEARCHER">Investigador</option>
                <option value="COLLABORATOR">Colaborador</option>
                <option value="STAFF">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="juan.perez@ciimed.pa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="+507 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedIn}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://linkedin.com/in/juanperez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://ciimed.pa/team/juan-perez"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidades
            </label>
            <input
              type="text"
              value={formData.specialties}
              onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Medicina Tropical, Investigación Clínica, Oncología (separadas por comas)"
            />
            <p className="text-xs text-gray-500 mt-1">Separa las especialidades con comas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Breve descripción del miembro del equipo..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Agregando...' : 'Agregar Miembro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ImportModal({ 
  onClose, 
  onSuccess 
}: { 
  onClose: () => void
  onSuccess: () => void 
}) {
  const [importType, setImportType] = useState<'json' | 'csv'>('json')
  const [file, setFile] = useState<File | null>(null)
  const [jsonText, setJsonText] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<any>(null)

  const downloadTemplate = (type: 'json' | 'csv') => {
    if (type === 'json') {
      const template = [
        {
          name: "Dr. Juan Pérez",
          position: "Investigador Senior",
          department: "Investigación",
          email: "juan.perez@ciimed.pa",
          phone: "+507 123-4567",
          bio: "Especialista en medicina tropical con 15 años de experiencia.",
          linkedIn: "https://linkedin.com/in/juanperez",
          website: "https://ciimed.pa/team/juan-perez",
          specialties: ["Medicina Tropical", "Investigación Clínica"],
          type: "RESEARCHER",
          status: "ACTIVE",
          order: 1
        }
      ]
      
      const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'plantilla-equipo.json'
      a.click()
      URL.revokeObjectURL(url)
    } else {
      const csvTemplate = `name,position,department,email,phone,bio,linkedin,website,specialties,type,status,order
Dr. Juan Pérez,Investigador Senior,Investigación,juan.perez@ciimed.pa,+507 123-4567,Especialista en medicina tropical,https://linkedin.com/in/juanperez,https://ciimed.pa/team/juan-perez,Medicina Tropical;Investigación Clínica,RESEARCHER,ACTIVE,1
Dra. María González,Directora de Investigación,Dirección,maria.gonzalez@ciimed.pa,+507 234-5678,Líder en investigación médica,https://linkedin.com/in/mariagonzalez,,Oncología;Bioestadística,DIRECTOR,ACTIVE,2`
      
      const blob = new Blob([csvTemplate], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'plantilla-equipo.csv'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setImportResults(null)
      
      // Si es un archivo JSON, cargar su contenido en el textarea
      if (importType === 'json' && selectedFile.type === 'application/json') {
        try {
          const text = await selectedFile.text()
          setJsonText(text)
        } catch (error) {
          console.error('Error reading JSON file:', error)
        }
      }
    }
  }

  const handleImport = async () => {
    setIsImporting(true)
    setImportResults(null)
    
    try {
      let response: Response
      
      if (importType === 'json') {
        let jsonData = jsonText.trim()
        
        // Si hay un archivo JSON seleccionado, usarlo en lugar del textarea
        if (file && file.type === 'application/json') {
          jsonData = await file.text()
        }
        
        if (!jsonData) {
          return
        }
        
        try {
          JSON.parse(jsonData) // Validar JSON
        } catch (error) {
          console.error('Invalid JSON:', error)
          return
        }
        
        response = await fetch('/api/team/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonData
        })
      } else {
        if (!file) {
          return
        }
        
        const csvText = await file.text()
        response = await fetch('/api/team/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/csv'
          },
          body: csvText
        })
      }
      
      const result = await response.json()
      setImportResults(result)
      
      if (response.ok) {
        if (result.imported > 0) {
          setTimeout(() => {
            onSuccess()
          }, 2000)
        }
      }
    } catch (error) {
      console.error('Import error:', error)
      setImportResults({
        error: 'Error al procesar la importación',
        details: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Importación Masiva de Equipo</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de importación
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="json"
                checked={importType === 'json'}
                onChange={(e) => setImportType(e.target.value as 'json')}
                className="mr-2"
              />
              JSON
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="csv"
                checked={importType === 'csv'}
                onChange={(e) => setImportType(e.target.value as 'csv')}
                className="mr-2"
              />
              CSV
            </label>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => downloadTemplate('json')}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar Plantilla JSON
            </button>
            <button
              onClick={() => downloadTemplate('csv')}
              className="flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              <Download className="h-4 w-4 mr-1" />
              Descargar Plantilla CSV
            </button>
          </div>
        </div>

        {importType === 'json' ? (
          <div className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subir archivo JSON
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Sube un archivo .json con los datos del equipo
              </p>
            </div>
            
            <div className="text-center text-gray-500 mb-4">
              <span>O</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pegar JSON directamente
              </label>
              <textarea
                rows={8}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                placeholder="Pega aquí el JSON con los datos del equipo..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: Array de objetos o objeto con propiedad "members"
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo CSV
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              El archivo debe tener encabezados en la primera fila
            </p>
          </div>
        )}

        {importResults && (
          <div className={`mb-6 p-4 rounded-md ${
            importResults.error ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          } border`}>
            {importResults.error ? (
              <div>
                <h4 className="font-medium text-red-800 mb-2">Error de importación</h4>
                <p className="text-red-700">{importResults.error}</p>
                {importResults.details && (
                  <>
                    <p className="text-red-600 text-sm mt-2">Detalles:</p>
                    {Array.isArray(importResults.details) ? (
                      <ul className="text-red-600 text-sm list-disc list-inside">
                        {importResults.details.map((detail: any, index: number) => (
                          <li key={index}>
                            {detail.name || `Fila ${detail.index + 1}`}: {
                              Array.isArray(detail.errors) ? detail.errors.join(', ') : detail.error
                            }
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-red-600 text-sm">{importResults.details}</p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div>
                <h4 className="font-medium text-green-800 mb-2">Importación exitosa</h4>
                <p className="text-green-700">{importResults.message}</p>
                <p className="text-green-600 text-sm">
                  {importResults.imported} de {importResults.total} miembros importados
                </p>
                {importResults.errors && importResults.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-orange-700 cursor-pointer">
                      Errores parciales ({importResults.errors.length})
                    </summary>
                    <ul className="text-orange-600 text-sm list-disc list-inside mt-1">
                      {importResults.errors.map((error: any, index: number) => (
                        <li key={index}>
                          {error.member}: {error.error}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-medium text-blue-800 mb-2">Campos soportados:</h4>
          <div className="text-blue-700 text-sm grid grid-cols-2 gap-2">
            <div>
              <strong>Requeridos:</strong>
              <ul className="list-disc list-inside">
                <li>name (nombre)</li>
                <li>position (cargo)</li>
                <li>department (departamento)</li>
                <li>type: DIRECTOR, RESEARCHER, COLLABORATOR, STAFF</li>
              </ul>
            </div>
            <div>
              <strong>Opcionales:</strong>
              <ul className="list-disc list-inside">
                <li>email, phone, bio</li>
                <li>linkedIn, website, avatar</li>
                <li>specialties (separadas por ; en CSV)</li>
                <li>status: ACTIVE, INACTIVE</li>
                <li>order (número)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isImporting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cerrar
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isImporting ? 'Importando...' : 'Importar'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EditMemberModal({ 
  member,
  onClose, 
  onSuccess,
  setTeamMembers
}: { 
  member: TeamMember
  onClose: () => void
  onSuccess: () => void
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>
}) {
  const [formData, setFormData] = useState({
    name: member.name,
    position: member.position,
    department: member.department,
    email: member.email || '',
    phone: member.phone || '',
    bio: member.bio || '',
    linkedIn: '',
    website: '',
    specialties: member.specialties.join(', '),
    type: member.type.toUpperCase(),
    avatar: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    try {
      // Usar el helper de UploadThing
      const { uploadFiles } = await import('@/lib/useUpload')
      
      const result = await uploadFiles('teamAvatars', {
        files: [file]
      })
      
      console.log('Upload result:', result)
      
      if (result && result.length > 0) {
        const file = result[0]
        console.log('File object:', file)
        console.log('Available file properties:', Object.keys(file))
        
        // Construir URL desde el key de UploadThing
        if (file.key) {
          const uploadThingUrl = `https://utfs.io/f/${file.key}`
          console.log('Constructed URL:', uploadThingUrl)
          return uploadThingUrl
        } else if (file.url) {
          return file.url
        } else {
          console.error('No key or URL found in upload result')
          throw new Error('No se recibió URL de la imagen subida')
        }
      } else {
        throw new Error('No se recibió resultado de la subida')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.position || !formData.department) {
      return
    }

    setIsSubmitting(true)
    try {
      let avatarUrl = formData.avatar
      
      // Subir imagen si se seleccionó una
      if (selectedFile) {
        avatarUrl = await uploadImage(selectedFile)
      }

      const response = await fetch(`/api/team/${member.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          avatar: avatarUrl,
          specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Actualizar inmediatamente el estado local del miembro editado
        setTeamMembers(prev => prev.map(m => 
          m.id === member.id 
            ? { 
                ...m, 
                ...formData,
                avatar: avatarUrl,
                specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
              }
            : m
        ))
        
        onSuccess()
      } else {
        const error = await response.json()
        console.error('Error updating member:', error.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error updating member:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Editar Miembro del Equipo</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto del miembro
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <Users className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                <p className="text-xs text-gray-500">
                  Formatos: JPG, PNG, GIF. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posición *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="DIRECTOR">Director</option>
                <option value="RESEARCHER">Investigador</option>
                <option value="COLLABORATOR">Colaborador</option>
                <option value="STAFF">Personal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidades
            </label>
            <input
              type="text"
              value={formData.specialties}
              onChange={(e) => setFormData(prev => ({ ...prev, specialties: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Separa las especialidades con comas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Breve descripción del miembro del equipo..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar Miembro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}