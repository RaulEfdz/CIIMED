'use client'

import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { InstitutionalInfo, EditModalProps } from './types'

export default function EditInstitutionalModal({ 
  info,
  onClose, 
  onSuccess,
  setInstitutionalInfo
}: EditModalProps) {
  const [formData, setFormData] = useState({
    name: info.name,
    description: info.description,
    subtitle: info.subtitle || '',
    mission: info.mission,
    vision: info.vision,
    values: info.values.join(', '),
    history: info.history || '',
    address: info.address || '',
    phone: info.phone || '',
    email: info.email || '',
    website: info.website || '',
    foundingYear: info.foundingYear.toString(),
    instagramUrl: info.instagramUrl || '',
    linkedinUrl: info.linkedinUrl || '',
    youtubeUrl: info.youtubeUrl || '',
    spotifyUrl: info.spotifyUrl || '',
    feature1Title: info.feature1Title || '',
    feature1Text: info.feature1Text || '',
    feature2Title: info.feature2Title || '',
    feature2Text: info.feature2Text || '',
    overlayColor: info.overlayColor || '#ffffff'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description || !formData.mission || !formData.vision) {
      return
    }

    setIsSubmitting(true)
    try {
      // Mantener las imágenes existentes, no se modifican en este modal
      const response = await fetch('/api/institutional', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          subtitle: formData.subtitle,
          mission: formData.mission,
          vision: formData.vision,
          values: formData.values.split(',').map(v => v.trim()).filter(v => v),
          history: formData.history,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          website: formData.website,
          foundingYear: parseInt(formData.foundingYear),
          // Mantener imágenes existentes
          logo: info.logo,
          image: info.image,
          heroImage: info.heroImage,
          historyImage: info.historyImage,
          instagramUrl: formData.instagramUrl,
          linkedinUrl: formData.linkedinUrl,
          youtubeUrl: formData.youtubeUrl,
          spotifyUrl: formData.spotifyUrl,
          feature1Title: formData.feature1Title,
          feature1Text: formData.feature1Text,
          feature2Title: formData.feature2Title,
          feature2Text: formData.feature2Text,
          overlayColor: formData.overlayColor,
          // Mantener datos del footer existentes
          footerBrand: info.footerBrand,
          footerEmail: info.footerEmail,
          footerPhone: info.footerPhone,
          footerAddress: info.footerAddress,
          footerCopyright: info.footerCopyright,
          footerBackgroundColor: info.footerBackgroundColor,
          footerTextColor: info.footerTextColor,
          footerAccentColor: info.footerAccentColor
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Actualizar estado local inmediatamente
        const updatedInfo: InstitutionalInfo = {
          ...info,
          ...formData,
          foundingYear: parseInt(formData.foundingYear),
          logo: logoUrl,
          image: imageUrl,
          values: formData.values.split(',').map(v => v.trim()).filter(v => v),
          updatedAt: new Date().toISOString()
        }
        
        setInstitutionalInfo(updatedInfo)
        onSuccess()
      } else {
        const error = await response.json()
        console.error('Error updating institutional info:', error.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error updating institutional info:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">Editar Información Institucional</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Institución *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Centro de Investigación..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Año de Fundación *
              </label>
              <input
                type="number"
                required
                min="1900"
                max={new Date().getFullYear()}
                value={formData.foundingYear}
                onChange={(e) => setFormData(prev => ({ ...prev, foundingYear: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="2020"
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
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="info@ciimed.pa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sitio Web
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://ciimed.pa"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Ciudad de Panamá, Panamá"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Breve descripción de la institución..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subtítulo (Hero Section)
            </label>
            <textarea
              rows={2}
              value={formData.subtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Un referente en investigación y desarrollo..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Misión *
            </label>
            <textarea
              rows={3}
              required
              value={formData.mission}
              onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nuestra misión es..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visión *
            </label>
            <textarea
              rows={3}
              required
              value={formData.vision}
              onChange={(e) => setFormData(prev => ({ ...prev, vision: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Nuestra visión es..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valores *
            </label>
            <input
              type="text"
              required
              value={formData.values}
              onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Excelencia, Integridad, Innovación (separados por comas)"
            />
            <p className="text-xs text-gray-500 mt-1">Separa los valores con comas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Historia
            </label>
            <textarea
              rows={4}
              value={formData.history}
              onChange={(e) => setFormData(prev => ({ ...prev, history: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Historia de la institución..."
            />
          </div>

          {/* Redes Sociales */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Redes Sociales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://www.instagram.com/ciimedpanama/"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://www.linkedin.com/company/ciimed/"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://www.youtube.com/channel/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spotify URL
                </label>
                <input
                  type="url"
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, spotifyUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://open.spotify.com/show/..."
                />
              </div>
            </div>
          </div>

          {/* Características Principales */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Características Principales</h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Característica 1 - Título
                  </label>
                  <input
                    type="text"
                    value={formData.feature1Title}
                    onChange={(e) => setFormData(prev => ({ ...prev, feature1Title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Investigación Avanzada"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Característica 2 - Título
                  </label>
                  <input
                    type="text"
                    value={formData.feature2Title}
                    onChange={(e) => setFormData(prev => ({ ...prev, feature2Title: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Colaboraciones Estratégicas"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Característica 1 - Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.feature1Text}
                  onChange={(e) => setFormData(prev => ({ ...prev, feature1Text: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="El centro está enfocado en el estudio de nuevas tecnologías..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Característica 2 - Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.feature2Text}
                  onChange={(e) => setFormData(prev => ({ ...prev, feature2Text: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Trabaja de manera conjunta con instituciones como SENACYT..."
                />
              </div>
            </div>
          </div>

          {/* Configuración Visual */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración Visual</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color de Overlay (Hero Section)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.overlayColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, overlayColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.overlayColor}
                  onChange={(e) => setFormData(prev => ({ ...prev, overlayColor: e.target.value }))}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  placeholder="#ffffff"
                />
              </div>
            </div>
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
              {isSubmitting ? 'Actualizando...' : 'Actualizar Información'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}