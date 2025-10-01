'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon, Eye, Trash2 } from 'lucide-react'
import { UploadButton } from '@/lib/uploadthing'
import Image from 'next/image'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  endpoint: 'institutionalImages' | 'backgroundImages' | 'teamAvatars' | 'mediaGallery'
  label?: string
  description?: string
  maxFiles?: number
  showPreview?: boolean
  className?: string
}

export default function ImageUploader({
  value,
  onChange,
  endpoint,
  label = 'Subir imagen',
  description = 'Selecciona una imagen para subir',
  maxFiles = 1,
  showPreview = true,
  className = ''
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const handleRemove = () => {
    onChange('')
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
      {value && showPreview && (
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
            <Image
              src={value}
              alt="Vista previa"
              fill
              className="object-cover"
            />
          </div>
          
          <div className="mt-2">
            <p className="text-xs text-gray-500 break-all">{value}</p>
          </div>
        </div>
      )}

      {/* Área de subida */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
        {isUploading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Subiendo imagen...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-600 mt-2">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <UploadButton
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                  console.log('Upload complete:', res)
                  setIsUploading(false)
                  if (res && res[0]) {
                    console.log('File URL:', res[0].url)
                    onChange(res[0].url)
                  } else {
                    console.error('No file URL received')
                    alert('Error: No se recibió URL de la imagen')
                  }
                }}
                onUploadError={(error: Error) => {
                  setIsUploading(false)
                  console.error('Error uploading:', error)
                  alert('Error al subir la imagen: ' + error.message)
                }}
                onUploadBegin={() => {
                  console.log('Upload starting...')
                  setIsUploading(true)
                }}
                appearance={{
                  button: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm cursor-pointer",
                  allowedContent: "text-xs text-gray-500 mt-2"
                }}
              />
            </div>
          </>
        )}
      </div>

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
                <Image
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