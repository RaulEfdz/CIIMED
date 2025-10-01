'use client'

import { useState } from 'react'
import { Newspaper, Upload, Star, Eye, Save, Edit } from 'lucide-react'
import { EditNewsModalProps } from './types'

export default function EditNewsModal({ 
  news,
  onClose, 
  onSuccess,
  setNews
}: EditNewsModalProps) {
  const [formData, setFormData] = useState({
    title: news.title,
    description: news.description,
    content: news.content || '',
    imageUrl: news.imageUrl || '',
    imageAlt: news.imageAlt || '',
    imgW: news.imgW || 800,
    imgH: news.imgH || 600,
    link: news.link || '',
    author: news.author,
    readTime: news.readTime,
    slug: news.slug,
    featured: news.featured,
    published: news.published,
    tags: news.tags.join(', '),
    metaTitle: news.metaTitle || '',
    metaDescription: news.metaDescription || '',
    publishedAt: new Date(news.publishedAt).toISOString().slice(0, 16)
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
        const uploadedFile = result[0]
        console.log('File object:', uploadedFile)
        
        if (uploadedFile.key) {
          const uploadThingUrl = `https://utfs.io/f/${uploadedFile.key}`
          console.log('Constructed URL:', uploadThingUrl)
          return uploadThingUrl
        } else if (uploadedFile.url) {
          return uploadedFile.url
        } else {
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
    if (!formData.title || !formData.description || !formData.author) {
      alert('Por favor completa los campos requeridos: título, descripción y autor')
      return
    }

    setIsSubmitting(true)
    try {
      let imageUrl = formData.imageUrl
      
      // Subir imagen si se seleccionó una nueva
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }

      const response = await fetch(`/api/news/${news.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          imgW: Number(formData.imgW) || 800,
          imgH: Number(formData.imgH) || 600,
          publishedAt: new Date(formData.publishedAt).toISOString()
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Actualizar estado local inmediatamente
        setNews(prev => prev.map(item => 
          item.id === news.id ? result.news : item
        ))
        onSuccess()
      } else {
        const error = await response.json()
        alert('Error: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error updating news:', error)
      alert('Error al actualizar noticia')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-6">
          <Newspaper className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-xl font-bold">Editar Noticia</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imagen Principal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen Principal
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Imagen actual" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mb-2"
                />
                <input
                  type="url"
                  placeholder="O ingresa URL de imagen"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formatos: JPG, PNG, GIF. Máximo 4MB.
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
                placeholder="Título de la noticia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Autor *
              </label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Nombre del autor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiempo de Lectura
              </label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="5 min"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enlace Externo
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://ejemplo.com/noticia"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción/Resumen *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Breve descripción de la noticia..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido Completo
            </label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Contenido completo de la noticia (opcional)..."
            />
          </div>

          {/* Configuración Avanzada */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración Avanzada</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="mi-noticia-2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Publicación
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

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
                <p className="text-xs text-gray-500 mt-1">Separa las etiquetas con comas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Texto Alternativo de Imagen
                </label>
                <input
                  type="text"
                  value={formData.imageAlt}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageAlt: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Descripción de la imagen para accesibilidad"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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

          {/* Opciones de Estado */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estado de Publicación</h3>
            
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700 flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  Publicada
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
                  Destacada
                </span>
              </label>
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
                  Actualizar Noticia
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}