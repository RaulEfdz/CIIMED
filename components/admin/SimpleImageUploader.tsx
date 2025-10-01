'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Eye, Trash2 } from 'lucide-react'
import SafeImage from './SafeImage'

type UploadEndpoint = 'institutionalImages' | 'backgroundImages' | 'teamAvatars' | 'mediaGallery'

interface SimpleImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  description?: string
  className?: string
  endpoint?: UploadEndpoint
}

export default function SimpleImageUploader({
  value,
  onChange,
  label = 'Subir imagen',
  description = 'Selecciona una imagen para subir',
  className = '',
  endpoint = 'institutionalImages'
}: SimpleImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('File selected:', file.name, file.type, file.size)

    setIsUploading(true)
    setUploadError(null)
    
    try {
      console.log(`Uploading file to ${endpoint} endpoint...`)

      const formData = new FormData()
      formData.append('files', file)

      // Try UploadThing first, fallback to local upload
      let response: Response
      let useLocalUpload = false

      try {
        console.log('Trying UploadThing...')
        response = await fetch(`/api/uploadthing?slug=${endpoint}`, {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          console.log('UploadThing failed, trying local upload...')
          useLocalUpload = true
        }
      } catch (uploadthingError) {
        console.log('UploadThing error, using local upload:', uploadthingError)
        useLocalUpload = true
      }

      if (useLocalUpload) {
        console.log('Using local upload...')
        response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
      }

      console.log('Upload response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed:', errorText)
        throw new Error(`Error ${response.status}: ${errorText || 'Error de conexión'}`)
      }

      const result = await response.json()
      console.log('Upload result:', result)

      let uploadedUrl: string | null = null
      
      if (result) {
        // Handle local upload response
        if (result.url) {
          uploadedUrl = result.url
        }
        // Handle UploadThing response formats
        else if (Array.isArray(result) && result.length > 0) {
          uploadedUrl = result[0].url || result[0].fileUrl
        }
        else if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          uploadedUrl = result.data[0].url || result.data[0].fileUrl
        }
      }

      if (uploadedUrl) {
        console.log('Setting image URL:', uploadedUrl)
        onChange(uploadedUrl)
        setUploadError(null)
      } else {
        console.error('No URL found in result:', result)
        throw new Error('No se recibió la URL de la imagen subida.')
      }

    } catch (error) {
      console.error('Error uploading file:', error)
      const errorMessage = (error as Error).message || 'Error desconocido al subir la imagen'
      setUploadError(errorMessage)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    onChange('')
    setUploadError(null)
  }

  const handleButtonClick = () => {
    setUploadError(null)
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      </div>

      {/* Vista previa de imagen actual */}
      {value && (
        <div className="relative bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-900">Imagen actual</h4>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Ver imagen completa"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-600 hover:text-red-800 p-1"
                title="Eliminar imagen"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            <SafeImage
              src={value}
              alt="Vista previa"
              width={300}
              height={128}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          <div className="mt-2">
            <p className="text-xs text-gray-500 break-all">{value}</p>
          </div>
        </div>
      )}

      {/* Error display */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al subir la imagen
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{uploadError}</p>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-xs font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Área de subida - Solo mostrar si no hay imagen o está subiendo */}
      {(!value || isUploading) && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
          {isUploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Selecciona una imagen para subir
              </p>
              <button
                type="button"
                onClick={handleButtonClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Seleccionar archivo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>
      )}

      {/* Botón de cambiar cuando ya hay imagen */}
      {value && !isUploading && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleButtonClick}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Cambiar imagen
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* Modal de vista previa */}
      {showPreviewModal && value && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Vista previa de imagen</h3>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative max-w-full max-h-[70vh]">
                <SafeImage
                  src={value}
                  alt="Vista previa completa"
                  width={800}
                  height={600}
                  className="object-contain max-w-full max-h-full"
                />
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 break-all">
                  <strong>URL:</strong> {value}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}