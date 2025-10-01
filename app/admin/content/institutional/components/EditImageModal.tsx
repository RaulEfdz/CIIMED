'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import SimpleImageUploader from '@/components/admin/SimpleImageUploader'
import { InstitutionalInfo } from './types'

interface EditImageModalProps {
  info: InstitutionalInfo
  imageType: 'logo' | 'heroImage' | 'image' | 'historyImage'
  onClose: () => void
  onSuccess: () => void
  setInstitutionalInfo: React.Dispatch<React.SetStateAction<InstitutionalInfo | null>>
}

const imageConfig = {
  logo: {
    title: 'Logo Institucional',
    description: 'Logo que aparece en el header y footer del sitio',
    endpoint: 'institutionalImages' as const,
    recommendations: 'Recomendado: 300x300px. Formatos: JPG, PNG, SVG. Máximo 8MB.'
  },
  heroImage: {
    title: 'Imagen Hero (Fondo)',
    description: 'Imagen de fondo para la sección hero principal',
    endpoint: 'backgroundImages' as const,
    recommendations: 'Recomendado: 1920x1080px. Formato: JPG. Máximo 10MB.'
  },
  image: {
    title: 'Imagen Nuestra Información',
    description: 'Imagen que acompaña la sección de Misión y Visión',
    endpoint: 'institutionalImages' as const,
    recommendations: 'Recomendado: 800x600px. Formatos: JPG, PNG. Máximo 8MB.'
  },
  historyImage: {
    title: 'Imagen Historia/Fundación',
    description: 'Imagen para la sección de historia y objetivos',
    endpoint: 'backgroundImages' as const,
    recommendations: 'Recomendado: 1200x675px. Formato: JPG. Máximo 10MB.'
  }
}

export default function EditImageModal({
  info,
  imageType,
  onClose,
  onSuccess,
  setInstitutionalInfo
}: EditImageModalProps) {
  const [imageUrl, setImageUrl] = useState(info[imageType] || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const config = imageConfig[imageType]

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
          logo: imageType === 'logo' ? imageUrl : info.logo,
          image: imageType === 'image' ? imageUrl : info.image,
          heroImage: imageType === 'heroImage' ? imageUrl : info.heroImage,
          historyImage: imageType === 'historyImage' ? imageUrl : info.historyImage,
          instagramUrl: info.instagramUrl,
          linkedinUrl: info.linkedinUrl,
          youtubeUrl: info.youtubeUrl,
          spotifyUrl: info.spotifyUrl,
          feature1Title: info.feature1Title,
          feature1Text: info.feature1Text,
          feature2Title: info.feature2Title,
          feature2Text: info.feature2Text,
          overlayColor: info.overlayColor,
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
        // Actualizar estado local inmediatamente
        const updatedInfo: InstitutionalInfo = {
          ...info,
          [imageType]: imageUrl,
          updatedAt: new Date().toISOString()
        }
        
        setInstitutionalInfo(updatedInfo)
        onSuccess()
      } else {
        const error = await response.json()
        console.error('Error updating image:', error.error || 'Error desconocido')
        alert('Error al actualizar la imagen: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error updating image:', error)
      alert('Error al actualizar la imagen')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Editar {config.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <SimpleImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            label={config.title}
            description={`${config.description}. ${config.recommendations}`}
            className="w-full"
          />

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