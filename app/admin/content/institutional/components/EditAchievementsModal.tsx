'use client'

import { useState } from 'react'
import { X, FlaskConical, Users, GraduationCap } from 'lucide-react'
import { InstitutionalInfo } from './types'

interface EditAchievementsModalProps {
  info: InstitutionalInfo
  onClose: () => void
  onSuccess: () => void
  setInstitutionalInfo: React.Dispatch<React.SetStateAction<InstitutionalInfo | null>>
}

export default function EditAchievementsModal({
  info,
  onClose,
  onSuccess,
  setInstitutionalInfo
}: EditAchievementsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estados para cada estadística
  const [researchValue, setResearchValue] = useState(info.achievementResearchValue || '150+')
  const [researchDesc, setResearchDesc] = useState(info.achievementResearchDesc || 'Proyectos de investigación completados')
  
  const [patientsValue, setPatientsValue] = useState(info.achievementPatientsValue || '10000+')
  const [patientsDesc, setPatientsDesc] = useState(info.achievementPatientsDesc || 'Personas beneficiadas')
  
  const [publicationsValue, setPublicationsValue] = useState(info.achievementPublicationsValue || '75+')
  const [publicationsDesc, setPublicationsDesc] = useState(info.achievementPublicationsDesc || 'Artículos científicos publicados')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/institutional', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // Mantener todos los campos existentes
          name: info.name,
          description: info.description,
          subtitle: info.subtitle,
          mission: info.mission,
          vision: info.vision,
          values: info.values,
          history: info.history,
          address: info.address,
          phone: info.phone,
          email: info.email,
          website: info.website,
          foundingYear: info.foundingYear,
          logo: info.logo,
          image: info.image,
          heroImage: info.heroImage,
          historyImage: info.historyImage,
          instagramUrl: info.instagramUrl,
          linkedinUrl: info.linkedinUrl,
          youtubeUrl: info.youtubeUrl,
          spotifyUrl: info.spotifyUrl,
          feature1Title: info.feature1Title,
          feature1Text: info.feature1Text,
          feature2Title: info.feature2Title,
          feature2Text: info.feature2Text,
          overlayColor: info.overlayColor,
          footerBrand: info.footerBrand,
          footerEmail: info.footerEmail,
          footerPhone: info.footerPhone,
          footerAddress: info.footerAddress,
          footerCopyright: info.footerCopyright,
          footerBackgroundColor: info.footerBackgroundColor,
          footerTextColor: info.footerTextColor,
          footerAccentColor: info.footerAccentColor,
          // Actualizar solo las estadísticas
          achievementResearchValue: researchValue,
          achievementResearchDesc: researchDesc,
          achievementPatientsValue: patientsValue,
          achievementPatientsDesc: patientsDesc,
          achievementPublicationsValue: publicationsValue,
          achievementPublicationsDesc: publicationsDesc
        })
      })

      if (response.ok) {
        // Actualizar estado local inmediatamente
        const updatedInfo: InstitutionalInfo = {
          ...info,
          achievementResearchValue: researchValue,
          achievementResearchDesc: researchDesc,
          achievementPatientsValue: patientsValue,
          achievementPatientsDesc: patientsDesc,
          achievementPublicationsValue: publicationsValue,
          achievementPublicationsDesc: publicationsDesc,
          updatedAt: new Date().toISOString()
        }
        
        setInstitutionalInfo(updatedInfo)
        onSuccess()
      } else {
        const error = await response.json()
        console.error('Error updating achievements:', error.error || 'Error desconocido')
        alert('Error al actualizar las estadísticas: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error updating achievements:', error)
      alert('Error al actualizar las estadísticas')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Editar Estadísticas de Logros</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Investigaciones */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <FlaskConical className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-blue-900">Proyectos de Investigación</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="researchValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (ej: 150+, 200, 50+)
                </label>
                <input
                  type="text"
                  id="researchValue"
                  value={researchValue}
                  onChange={(e) => setResearchValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-2xl font-bold text-blue-600"
                  placeholder="150+"
                />
              </div>
              <div>
                <label htmlFor="researchDesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  id="researchDesc"
                  value={researchDesc}
                  onChange={(e) => setResearchDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Proyectos de investigación completados"
                />
              </div>
            </div>
          </div>

          {/* Pacientes */}
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-green-900">Personas Beneficiadas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="patientsValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (ej: 10000+, 5K, 15000)
                </label>
                <input
                  type="text"
                  id="patientsValue"
                  value={patientsValue}
                  onChange={(e) => setPatientsValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-2xl font-bold text-green-600"
                  placeholder="10000+"
                />
              </div>
              <div>
                <label htmlFor="patientsDesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  id="patientsDesc"
                  value={patientsDesc}
                  onChange={(e) => setPatientsDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Personas beneficiadas"
                />
              </div>
            </div>
          </div>

          {/* Publicaciones */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-purple-900">Publicaciones Científicas</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="publicationsValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Valor (ej: 75+, 100, 50+)
                </label>
                <input
                  type="text"
                  id="publicationsValue"
                  value={publicationsValue}
                  onChange={(e) => setPublicationsValue(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-2xl font-bold text-purple-600"
                  placeholder="75+"
                />
              </div>
              <div>
                <label htmlFor="publicationsDesc" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  id="publicationsDesc"
                  value={publicationsDesc}
                  onChange={(e) => setPublicationsDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Artículos científicos publicados"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <FlaskConical className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{researchValue}</div>
                <div className="text-sm text-gray-600">{researchDesc}</div>
              </div>
              <div className="text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{patientsValue}</div>
                <div className="text-sm text-gray-600">{patientsDesc}</div>
              </div>
              <div className="text-center">
                <GraduationCap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{publicationsValue}</div>
                <div className="text-sm text-gray-600">{publicationsDesc}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm font-medium flex items-center"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}