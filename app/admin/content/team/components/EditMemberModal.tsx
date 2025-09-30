'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import { TeamMember, EditModalProps } from './types'

export default function EditMemberModal({ 
  member,
  onClose, 
  onSuccess,
  setTeamMembers
}: EditModalProps) {
  const [formData, setFormData] = useState({
    name: member.name,
    position: member.position,
    department: member.department,
    email: member.email || '',
    phone: member.phone || '',
    bio: member.bio || '',
    linkedIn: member.linkedIn || '',
    website: member.website || '',
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
      const { uploadFiles } = await import('@/lib/useUpload')
      
      const result = await uploadFiles('teamAvatars', {
        files: [file]
      })
      
      console.log('Upload result:', result)
      
      if (result && result.length > 0) {
        const file = result[0]
        console.log('File object:', file)
        console.log('Available file properties:', Object.keys(file))
        
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
        
        setTeamMembers(prev => prev.map(m => 
          m.id === member.id 
            ? { 
                ...m, 
                ...formData,
                avatar: avatarUrl,
                linkedIn: formData.linkedIn,
                website: formData.website,
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto del miembro
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
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