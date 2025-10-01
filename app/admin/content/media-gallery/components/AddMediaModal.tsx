'use client'

import { useState } from 'react'
import { Image, Upload, Star, Eye, Save, Calendar, FileText, Video, Music, Globe } from 'lucide-react'
import { useMediaGallery, MediaType, MediaQuality } from '@/hooks/useMediaGallery'

interface AddMediaModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddMediaModal({ 
  onClose, 
  onSuccess
}: AddMediaModalProps) {
  const { createMediaItem } = useMediaGallery()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alt: '',
    type: 'IMAGE' as MediaType,
    category: '',
    subcategory: '',
    tags: '',
    fileUrl: '',
    thumbnailUrl: '',
    previewUrl: '',
    fileName: '',
    fileSize: 0,
    mimeType: '',
    duration: 0,
    width: 0,
    height: 0,
    aspectRatio: '',
    author: '',
    source: '',
    copyright: '',
    license: '',
    location: '',
    capturedAt: '',
    eventDate: '',
    featured: false,
    published: true,
    allowDownload: false,
    quality: 'HIGH' as MediaQuality,
    collection: '',
    albumId: '',
    order: 0,
    priority: 0,
    relatedLink: '',
    externalUrl: '',
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    showInGallery: true,
    showInSlideshow: false,
    allowComments: false
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
      
      // Auto-fill file information
      setFormData(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        alt: prev.alt || file.name.split('.')[0]
      }))
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    try {
      const { uploadFiles } = await import('@/lib/useUpload')
      
      const result = await uploadFiles('teamAvatars', {
        files: [file]
      })
      
      if (result && result.length > 0) {
        const uploadedFile = result[0]
        
        if (uploadedFile.key) {
          return `https://utfs.io/f/${uploadedFile.key}`
        } else if (uploadedFile.url) {
          return uploadedFile.url
        } else {
          throw new Error('No se recibió URL del archivo subido')
        }
      } else {
        throw new Error('No se recibió resultado de la subida')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  // Generar slug automático basado en el título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      metaTitle: prev.metaTitle || title,
      alt: prev.alt || title
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.fileUrl || !selectedFile) {
      alert('Por favor completa los campos requeridos: título, descripción y archivo')
      return
    }

    setIsSubmitting(true)
    try {
      let fileUrl = formData.fileUrl
      
      // Subir archivo si se seleccionó uno
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile)
      }

      const mediaData = {
        ...formData,
        fileUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        keywords: formData.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword),
        capturedAt: formData.capturedAt ? new Date(formData.capturedAt).toISOString() : undefined,
        fileSize: formData.fileSize || selectedFile?.size || 0,
        mimeType: formData.mimeType || selectedFile?.type || '',
        fileName: formData.fileName || selectedFile?.name || ''
      }

      const result = await createMediaItem(mediaData)

      if (result.success) {
        onSuccess()
      } else {
        alert('Error: ' + (result.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error creating media item:', error)
      alert('Error al crear elemento multimedia')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMediaIcon = (type: MediaType) => {
    switch (type) {
      case 'IMAGE':
        return <Image className="h-5 w-5" />
      case 'VIDEO':
        return <Video className="h-5 w-5" />
      case 'DOCUMENT':
        return <FileText className="h-5 w-5" />
      case 'AUDIO':
        return <Music className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="flex items-center mb-6">
          {getMediaIcon(formData.type)}
          <h2 className="text-xl font-bold ml-3">Agregar Elemento Multimedia</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Medio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Elemento *
            </label>
            <div className="grid grid-cols-4 gap-4">
              {(['IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO'] as MediaType[]).map((type) => (
                <label key={type} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as MediaType }))}
                    className="mr-3"
                  />
                  {getMediaIcon(type)}
                  <span className="ml-2 text-sm font-medium">
                    {type === 'IMAGE' && 'Imagen'}
                    {type === 'VIDEO' && 'Video'}
                    {type === 'DOCUMENT' && 'Documento'}
                    {type === 'AUDIO' && 'Audio'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Archivo Principal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo Principal *
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {previewUrl && formData.type === 'IMAGE' ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : formData.fileUrl && formData.type === 'IMAGE' ? (
                  <img src={formData.fileUrl} alt="Archivo actual" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400">
                    {getMediaIcon(formData.type)}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept={
                    formData.type === 'IMAGE' ? 'image/*' :
                    formData.type === 'VIDEO' ? 'video/*' :
                    formData.type === 'AUDIO' ? 'audio/*' :
                    '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
                  }
                  onChange={handleFileChange}
                  className="mb-2"
                  required={!formData.fileUrl}
                />
                <input
                  type="url"
                  placeholder="O ingresa URL del archivo"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 10MB. Formatos: 
                  {formData.type === 'IMAGE' && ' JPG, PNG, GIF, SVG, WebP'}
                  {formData.type === 'VIDEO' && ' MP4, WebM, MOV, AVI'}
                  {formData.type === 'AUDIO' && ' MP3, WAV, OGG'}
                  {formData.type === 'DOCUMENT' && ' PDF, DOC, PPT, XLS, TXT'}
                </p>
              </div>
            </div>
          </div>

          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Título del elemento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor/Fuente
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Nombre del autor o fuente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Seleccionar categoría</option>
                <option value="Investigación">Investigación</option>
                <option value="Eventos">Eventos</option>
                <option value="Institucional">Institucional</option>
                <option value="Educación">Educación</option>
                <option value="Noticias">Noticias</option>
                <option value="Recursos">Recursos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategoría
              </label>
              <input
                type="text"
                value={formData.subcategory}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Subcategoría específica"
              />
            </div>
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
              placeholder="Descripción del elemento multimedia..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto Alternativo (Alt)
            </label>
            <input
              type="text"
              value={formData.alt}
              onChange={(e) => setFormData(prev => ({ ...prev, alt: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Descripción para accesibilidad"
            />
          </div>

          {/* Metadatos Específicos */}
          {(formData.type === 'IMAGE' || formData.type === 'VIDEO') && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Dimensiones y Calidad</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ancho (px)
                  </label>
                  <input
                    type="number"
                    value={formData.width || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, width: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="1920"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alto (px)
                  </label>
                  <input
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, height: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="1080"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ratio de Aspecto
                  </label>
                  <input
                    type="text"
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData(prev => ({ ...prev, aspectRatio: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="16:9"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calidad
                  </label>
                  <select
                    value={formData.quality}
                    onChange={(e) => setFormData(prev => ({ ...prev, quality: e.target.value as MediaQuality }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="ORIGINAL">Original</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Duración para Video/Audio */}
          {(formData.type === 'VIDEO' || formData.type === 'AUDIO') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (segundos)
              </label>
              <input
                type="number"
                value={formData.duration || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="120"
              />
            </div>
          )}

          {/* URLs Adicionales */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">URLs Adicionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Miniatura
                </label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://ejemplo.com/thumbnail.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Vista Previa
                </label>
                <input
                  type="url"
                  value={formData.previewUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, previewUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://ejemplo.com/preview.mp4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enlace Relacionado
                </label>
                <input
                  type="url"
                  value={formData.relatedLink}
                  onChange={(e) => setFormData(prev => ({ ...prev, relatedLink: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://ejemplo.com/noticia-relacionada"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Externa
                </label>
                <input
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, externalUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://ejemplo.com/recurso-externo"
                />
              </div>
            </div>
          </div>

          {/* Información Contextual */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información Contextual</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ciudad de la Salud, Panamá"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Captura
                </label>
                <input
                  type="datetime-local"
                  value={formData.capturedAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, capturedAt: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha del Evento
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Colección
                </label>
                <input
                  type="text"
                  value={formData.collection}
                  onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Nombre de la colección"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copyright
                </label>
                <input
                  type="text"
                  value={formData.copyright}
                  onChange={(e) => setFormData(prev => ({ ...prev, copyright: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="© 2025 CIIMED"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Licencia
                </label>
                <input
                  type="text"
                  value={formData.license}
                  onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="CC BY-SA 4.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuente
                </label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Fuente original"
                />
              </div>
            </div>
          </div>

          {/* Etiquetas y SEO */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Etiquetas y SEO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etiquetas
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="investigación, medicina, ciencia (separadas por comas)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Palabras Clave
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="medicina, investigación, ciencia (separadas por comas)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Título (SEO)
                </label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Título optimizado para buscadores"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Descripción (SEO)
                </label>
                <textarea
                  rows={2}
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Descripción para resultados de búsqueda"
                />
              </div>
            </div>
          </div>

          {/* Configuraciones */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuraciones</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Estado y Visibilidad */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Estado y Visibilidad</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Publicar inmediatamente
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Marcar como destacado
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showInGallery}
                      onChange={(e) => setFormData(prev => ({ ...prev, showInGallery: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Mostrar en galería principal
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.showInSlideshow}
                      onChange={(e) => setFormData(prev => ({ ...prev, showInSlideshow: e.target.checked }))}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Incluir en slideshow
                    </span>
                  </label>
                </div>
              </div>

              {/* Permisos y Funcionalidades */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Permisos y Funcionalidades</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowDownload}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowDownload: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Permitir descarga directa
                    </span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowComments: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Permitir comentarios
                    </span>
                  </label>

                  {/* Campos numéricos */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Orden (0-100)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Prioridad (0-10)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
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
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Elemento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}