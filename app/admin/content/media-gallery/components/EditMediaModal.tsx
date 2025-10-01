'use client'

import { useState } from 'react'
import { Image, Upload, Star, Eye, Save, Edit, FileText, Video, Music } from 'lucide-react'
import { useMediaGallery, MediaGalleryItem, MediaType, MediaQuality } from '@/hooks/useMediaGallery'

interface EditMediaModalProps {
  mediaItem: MediaGalleryItem
  onClose: () => void
  onSuccess: () => void
}

export default function EditMediaModal({ 
  mediaItem,
  onClose, 
  onSuccess
}: EditMediaModalProps) {
  const { updateMediaItem } = useMediaGallery()
  
  const [formData, setFormData] = useState({
    title: mediaItem.title,
    description: mediaItem.description,
    alt: mediaItem.alt || '',
    type: mediaItem.type,
    category: mediaItem.category || '',
    subcategory: mediaItem.subcategory || '',
    tags: mediaItem.tags.join(', '),
    fileUrl: mediaItem.fileUrl,
    thumbnailUrl: mediaItem.thumbnailUrl || '',
    previewUrl: mediaItem.previewUrl || '',
    fileName: mediaItem.fileName || '',
    fileSize: mediaItem.fileSize || 0,
    mimeType: mediaItem.mimeType || '',
    duration: mediaItem.duration || 0,
    width: mediaItem.width || 0,
    height: mediaItem.height || 0,
    aspectRatio: mediaItem.aspectRatio || '',
    author: mediaItem.author || '',
    source: mediaItem.source || '',
    copyright: mediaItem.copyright || '',
    license: mediaItem.license || '',
    location: mediaItem.location || '',
    capturedAt: mediaItem.capturedAt ? new Date(mediaItem.capturedAt).toISOString().slice(0, 16) : '',
    eventDate: mediaItem.eventDate || '',
    featured: mediaItem.featured,
    published: mediaItem.published,
    allowDownload: mediaItem.allowDownload,
    quality: mediaItem.quality,
    collection: mediaItem.collection || '',
    albumId: mediaItem.albumId || '',
    order: mediaItem.order,
    priority: mediaItem.priority,
    relatedLink: mediaItem.relatedLink || '',
    externalUrl: mediaItem.externalUrl || '',
    metaTitle: mediaItem.metaTitle || '',
    metaDescription: mediaItem.metaDescription || '',
    keywords: mediaItem.keywords.join(', '),
    showInGallery: mediaItem.showInGallery,
    showInSlideshow: mediaItem.showInSlideshow,
    allowComments: mediaItem.allowComments
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
        mimeType: file.type
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      alert('Por favor completa los campos requeridos: título y descripción')
      return
    }

    setIsSubmitting(true)
    try {
      let fileUrl = formData.fileUrl
      
      // Subir nuevo archivo si se seleccionó uno
      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile)
      }

      const updateData = {
        ...formData,
        fileUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        keywords: formData.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword),
        capturedAt: formData.capturedAt ? new Date(formData.capturedAt).toISOString() : undefined,
        fileSize: selectedFile ? selectedFile.size : formData.fileSize,
        mimeType: selectedFile ? selectedFile.type : formData.mimeType,
        fileName: selectedFile ? selectedFile.name : formData.fileName
      }

      const result = await updateMediaItem(mediaItem.id, updateData)

      if (result.success) {
        onSuccess()
      } else {
        alert('Error: ' + (result.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error updating media item:', error)
      alert('Error al actualizar elemento multimedia')
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
          <h2 className="text-xl font-bold ml-3">Editar Elemento Multimedia</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Medio (solo mostrar, no editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Elemento
            </label>
            <div className="p-3 bg-gray-50 rounded-lg flex items-center">
              {getMediaIcon(formData.type)}
              <span className="ml-2 text-sm font-medium text-gray-700">
                {formData.type === 'IMAGE' && 'Imagen'}
                {formData.type === 'VIDEO' && 'Video'}
                {formData.type === 'DOCUMENT' && 'Documento'}
                {formData.type === 'AUDIO' && 'Audio'}
              </span>
            </div>
          </div>

          {/* Archivo Principal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Archivo Principal
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
                />
                <input
                  type="url"
                  placeholder="O ingresa URL del archivo"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Actual: {formData.fileName || 'Sin nombre'} ({Math.round((formData.fileSize || 0) / 1024)} KB)
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
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                      Publicado
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
                      Destacado
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

          {/* Estadísticas (solo lectura) */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Visualizaciones</p>
                <p className="text-lg font-semibold">{mediaItem.views}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Descargas</p>
                <p className="text-lg font-semibold">{mediaItem.downloads}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Creado</p>
                <p className="text-sm">{new Date(mediaItem.createdAt).toLocaleDateString('es-ES')}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600">Actualizado</p>
                <p className="text-sm">{new Date(mediaItem.updatedAt).toLocaleDateString('es-ES')}</p>
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
                  Actualizando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Actualizar Elemento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}