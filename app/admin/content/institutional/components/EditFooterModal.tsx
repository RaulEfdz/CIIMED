'use client'

import { useState } from 'react'
import { Palette, Mail, Phone, MapPin, Building2, Copyright } from 'lucide-react'
import { InstitutionalInfo, ModalProps } from './types'

interface EditFooterModalProps extends ModalProps {
  info: InstitutionalInfo
}

export default function EditFooterModal({ 
  info,
  onClose, 
  onSuccess,
  setInstitutionalInfo
}: EditFooterModalProps) {
  const [formData, setFormData] = useState({
    footerBrand: info.footerBrand || '',
    footerEmail: info.footerEmail || '',
    footerPhone: info.footerPhone || '',
    footerAddress: info.footerAddress || '',
    footerCopyright: info.footerCopyright || '',
    footerBackgroundColor: info.footerBackgroundColor || '#285C4D',
    footerTextColor: info.footerTextColor || '#ffffff',
    footerAccentColor: info.footerAccentColor || '#F4633A'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
          // Enviar todos los datos existentes + los cambios del footer
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
          instagramUrl: info.instagramUrl,
          linkedinUrl: info.linkedinUrl,
          youtubeUrl: info.youtubeUrl,
          spotifyUrl: info.spotifyUrl,
          feature1Title: info.feature1Title,
          feature1Text: info.feature1Text,
          feature2Title: info.feature2Title,
          feature2Text: info.feature2Text,
          overlayColor: info.overlayColor,
          // Solo actualizamos los campos del footer
          footerBrand: formData.footerBrand,
          footerEmail: formData.footerEmail,
          footerPhone: formData.footerPhone,
          footerAddress: formData.footerAddress,
          footerCopyright: formData.footerCopyright,
          footerBackgroundColor: formData.footerBackgroundColor,
          footerTextColor: formData.footerTextColor,
          footerAccentColor: formData.footerAccentColor
        })
      })

      if (response.ok) {
        // Actualizar estado local inmediatamente
        const updatedInfo: InstitutionalInfo = {
          ...info,
          footerBrand: formData.footerBrand,
          footerEmail: formData.footerEmail,
          footerPhone: formData.footerPhone,
          footerAddress: formData.footerAddress,
          footerCopyright: formData.footerCopyright,
          footerBackgroundColor: formData.footerBackgroundColor,
          footerTextColor: formData.footerTextColor,
          footerAccentColor: formData.footerAccentColor,
          updatedAt: new Date().toISOString()
        }
        
        setInstitutionalInfo(updatedInfo)
        onSuccess()
      } else {
        const error = await response.json()
        console.error('Error updating footer:', error.error || 'Error desconocido')
      }
    } catch (error) {
      console.error('Error updating footer:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center mb-6">
          <Palette className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-bold">Configuración del Footer</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Información de Contacto del Footer */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  Nombre de la Marca (Footer)
                </label>
                <input
                  type="text"
                  value={formData.footerBrand}
                  onChange={(e) => setFormData(prev => ({ ...prev, footerBrand: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder={`CIIMED (por defecto: "${info.name}")`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si está vacío, usará el nombre principal de la institución
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="h-4 w-4 inline mr-1" />
                  Email del Footer
                </label>
                <input
                  type="email"
                  value={formData.footerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, footerEmail: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder={`info@ciimed.pa (por defecto: "${info.email}")`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si está vacío, usará el email principal
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Phone className="h-4 w-4 inline mr-1" />
                  Teléfono del Footer
                </label>
                <input
                  type="tel"
                  value={formData.footerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, footerPhone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder={`+507 123-4567 (por defecto: "${info.phone}")`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si está vacío, usará el teléfono principal
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Dirección del Footer
                </label>
                <input
                  type="text"
                  value={formData.footerAddress}
                  onChange={(e) => setFormData(prev => ({ ...prev, footerAddress: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder={`Ciudad de la Salud, Panamá (por defecto: "${info.address}")`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Si está vacío, usará la dirección principal
                </p>
              </div>
            </div>
          </div>

          {/* Texto de Copyright */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              <Copyright className="h-5 w-5 inline mr-2" />
              Copyright Personalizado
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto de Copyright
              </label>
              <input
                type="text"
                value={formData.footerCopyright}
                onChange={(e) => setFormData(prev => ({ ...prev, footerCopyright: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder={`© ${new Date().getFullYear()} ${info.name}. Todos los derechos reservados.`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Si está vacío, usará el formato automático con el año actual
              </p>
            </div>
          </div>

          {/* Configuración de Colores del Footer */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Colores del Footer</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color de Fondo
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.footerBackgroundColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, footerBackgroundColor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.footerBackgroundColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, footerBackgroundColor: e.target.value }))}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                      placeholder="#285C4D"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color del Texto
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.footerTextColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, footerTextColor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.footerTextColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, footerTextColor: e.target.value }))}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                      placeholder="#ffffff"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color de Acento (Links/Iconos)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.footerAccentColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, footerAccentColor: e.target.value }))}
                      className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.footerAccentColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, footerAccentColor: e.target.value }))}
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 font-mono text-sm"
                      placeholder="#F4633A"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Vista Previa</h3>
            <div 
              className="p-6 rounded-lg border-2"
              style={{ 
                backgroundColor: formData.footerBackgroundColor,
                color: formData.footerTextColor
              }}
            >
              <div className="text-lg font-bold mb-3">
                {formData.footerBrand || info.name || 'CIIMED'}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" style={{ color: formData.footerAccentColor }} />
                  {formData.footerEmail || info.email || 'info@ciimed.pa'}
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" style={{ color: formData.footerAccentColor }} />
                  {formData.footerPhone || info.phone || '+507 123-4567'}
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" style={{ color: formData.footerAccentColor }} />
                  {formData.footerAddress || info.address || 'Ciudad de la Salud, Panamá'}
                </div>
                <div className="text-xs opacity-75 mt-4 pt-3 border-t border-opacity-20" style={{ borderColor: formData.footerTextColor }}>
                  {formData.footerCopyright || `© ${new Date().getFullYear()} ${info.name || 'CIIMED'}. Todos los derechos reservados.`}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <Palette className="h-4 w-4 mr-2" />
                  Actualizar Footer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}