'use client'

import { InstitutionalInfo } from './types'
import { Monitor, Image as ImageIcon, FileImage, Edit } from 'lucide-react'
import SafeImage from '@/components/admin/SafeImage'

interface AboutMultimediaPreviewProps {
  info: InstitutionalInfo
  onEditImage?: (imageType: 'logo' | 'heroImage' | 'image' | 'historyImage') => void
}

export default function AboutMultimediaPreview({ info, onEditImage }: AboutMultimediaPreviewProps) {
  const defaultImage = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"

  const sections = [
    {
      id: 'hero',
      title: 'Hero Section',
      description: 'Imagen de fondo de la sección principal',
      icon: Monitor,
      imageUrl: info.heroImage || defaultImage,
      color: 'bg-blue-500',
      aspectRatio: '16:9',
      imageType: 'heroImage' as const
    },
    {
      id: 'about',
      title: 'Nuestra Información',
      description: 'Imagen junto a Misión y Visión',
      icon: ImageIcon,
      imageUrl: info.image || defaultImage,
      color: 'bg-green-500',
      aspectRatio: '4:3',
      imageType: 'image' as const
    },
    {
      id: 'history',
      title: 'Historia/Fundación',
      description: 'Imagen de la sección de historia',
      icon: FileImage,
      imageUrl: info.historyImage || defaultImage,
      color: 'bg-purple-500',
      aspectRatio: '16:9',
      imageType: 'historyImage' as const
    }
  ]

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="p-3 rounded-lg bg-orange-100">
            <ImageIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900">Multimedia de Sobre Nosotros</h2>
            <p className="text-sm text-gray-600">Vista previa de las imágenes en cada sección</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section) => {
          const IconComponent = section.icon
          return (
            <div key={section.id} className="bg-gray-50 rounded-lg p-4 border">
              {/* Header de la sección */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`p-2 rounded ${section.color} bg-opacity-10`}>
                    <IconComponent className={`h-4 w-4 ${section.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                    <p className="text-xs text-gray-500">{section.description}</p>
                  </div>
                </div>
                {onEditImage && (
                  <button
                    onClick={() => onEditImage(section.imageType)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </button>
                )}
              </div>

              {/* Vista previa de imagen */}
              <div className={`relative bg-gray-200 rounded-lg overflow-hidden ${
                section.aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[4/3]'
              }`}>
                <SafeImage
                  src={section.imageUrl}
                  alt={`Vista previa de ${section.title}`}
                  width={400}
                  height={300}
                  className="absolute inset-0 w-full h-full object-cover"
                  fallbackSrc={defaultImage}
                />
                
                {/* Overlay con estado */}
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    section.imageUrl === defaultImage 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {section.imageUrl === defaultImage ? 'Por defecto' : 'Personalizada'}
                  </span>
                </div>
              </div>

              {/* URL de la imagen */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 break-all">
                  {section.imageUrl.length > 50 
                    ? `${section.imageUrl.substring(0, 50)}...`
                    : section.imageUrl
                  }
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Información</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Hero:</strong> Imagen de fondo de 1920x1080px recomendada</p>
          <p><strong>Nuestra Información:</strong> Imagen 800x600px para acompañar misión/visión</p>
          <p><strong>Historia:</strong> Imagen 1200x675px para la sección de fundación</p>
        </div>
      </div>
      </div>
    </div>
  )
}