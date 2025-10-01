'use client'

import { useState } from 'react'
import { Calendar, Upload, Star, Eye, Save, Clock, MapPin, Users, DollarSign } from 'lucide-react'
import { AddEventModalProps } from './types'

export default function AddEventModal({ 
  onClose, 
  onSuccess,
  setEvents
}: AddEventModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    imageAlt: '',
    imgW: 400,
    imgH: 300,
    link: '',
    date: '',
    time: '',
    location: '',
    speaker: '',
    speakers: '',
    category: '',
    slug: '',
    featured: false,
    published: true,
    capacity: '',
    price: '',
    currency: 'USD',
    tags: '',
    eventDate: '',
    registrationEnd: ''
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

  // Generar slug automático basado en el título
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title), // Solo auto-generar si no hay slug manual
    }))
  }

  const handleDateChange = (date: string) => {
    setFormData(prev => ({
      ...prev,
      date,
      eventDate: prev.eventDate || date // Sincronizar eventDate si no está configurado
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.date || !formData.time || !formData.location) {
      alert('Por favor completa los campos requeridos: título, descripción, fecha, hora y ubicación')
      return
    }

    setIsSubmitting(true)
    try {
      let imageUrl = formData.imageUrl
      
      // Subir imagen si se seleccionó una
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile)
      }

      // Generar slug final si no se proporcionó
      const finalSlug = formData.slug || generateSlug(formData.title)

      // Preparar eventDate - combinar fecha y hora si es necesario
      let eventDate = formData.eventDate
      if (!eventDate && formData.date) {
        eventDate = formData.date
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          slug: finalSlug,
          speakers: formData.speakers.split(',').map(speaker => speaker.trim()).filter(speaker => speaker),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          imgW: Number(formData.imgW) || 400,
          imgH: Number(formData.imgH) || 300,
          capacity: formData.capacity ? Number(formData.capacity) : null,
          price: formData.price ? Number(formData.price) : null,
          eventDate: new Date(eventDate).toISOString(),
          registrationEnd: formData.registrationEnd ? new Date(formData.registrationEnd).toISOString() : null
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Actualizar estado local inmediatamente
        setEvents(prev => [result.event, ...prev])
        onSuccess()
      } else {
        const error = await response.json()
        alert('Error: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Error al crear evento')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-6">
          <Calendar className="h-6 w-6 text-indigo-600 mr-3" />
          <h2 className="text-xl font-bold">Crear Nuevo Evento</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imagen Principal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen del Evento
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
                Título del Evento *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Workshop de Investigación"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Workshop, Conferencia, Seminario"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora *
              </label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="14:00 - 17:00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ubicación *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Auditorio Principal, Virtual, etc."
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
              placeholder="Breve descripción del evento..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción Detallada
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Descripción completa del evento (opcional)..."
            />
          </div>

          {/* Ponentes y Detalles */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ponentes y Detalles</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ponente Principal
                </label>
                <input
                  type="text"
                  value={formData.speaker}
                  onChange={(e) => setFormData(prev => ({ ...prev, speaker: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Dr. Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Otros Ponentes
                </label>
                <input
                  type="text"
                  value={formData.speakers}
                  onChange={(e) => setFormData(prev => ({ ...prev, speakers: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Dra. María García, Dr. Carlos López (separados por comas)"
                />
                <p className="text-xs text-gray-500 mt-1">Separa los ponentes con comas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad Máxima
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    placeholder="0 para gratuito"
                  />
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                    className="border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="PAB">PAB</option>
                  </select>
                </div>
              </div>
            </div>
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
                  placeholder="workshop-investigacion-2024"
                />
                <p className="text-xs text-gray-500 mt-1">Se genera automáticamente si se deja vacío</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Completa del Evento
                </label>
                <input
                  type="datetime-local"
                  value={formData.eventDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">Para ordenamiento preciso</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Límite de Registro
                </label>
                <input
                  type="datetime-local"
                  value={formData.registrationEnd}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationEnd: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enlace de Información/Registro
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="https://ejemplo.com/evento"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etiquetas
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="investigación, medicina, workshop (separadas por comas)"
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
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Crear Evento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}