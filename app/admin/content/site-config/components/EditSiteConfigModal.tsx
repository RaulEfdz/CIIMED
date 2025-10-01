'use client'

import { useState } from 'react';
import { X, Save, Globe, Eye, Image, Palette, MessageSquare, Link, Settings } from 'lucide-react';
import { SiteConfig } from '@/hooks/useSiteConfig';

interface EditSiteConfigModalProps {
  siteConfig: SiteConfig;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditSiteConfigModal({ siteConfig, onClose, onSuccess }: EditSiteConfigModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'branding' | 'colors' | 'contact' | 'navigation' | 'system'>('general');

  // Inicializar datos del formulario
  const [formData, setFormData] = useState({
    // General
    siteName: siteConfig.siteName || '',
    siteDescription: siteConfig.siteDescription || '',
    siteKeywords: siteConfig.siteKeywords?.join(', ') || '',
    siteUrl: siteConfig.siteUrl || '',
    
    // SEO
    metaTitle: siteConfig.metaTitle || '',
    metaDescription: siteConfig.metaDescription || '',
    ogImage: siteConfig.ogImage || '',
    ogDescription: siteConfig.ogDescription || '',
    
    // Branding
    primaryLogo: siteConfig.primaryLogo || '',
    secondaryLogo: siteConfig.secondaryLogo || '',
    favicon: siteConfig.favicon || '',
    
    // Colores
    primaryColor: siteConfig.primaryColor || '#285C4D',
    secondaryColor: siteConfig.secondaryColor || '#F4633A',
    accentColor: siteConfig.accentColor || '#212322',
    lightColor: siteConfig.lightColor || '#f2f2f2',
    
    // Contacto
    globalEmail: siteConfig.globalEmail || '',
    globalPhone: siteConfig.globalPhone || '',
    globalAddress: siteConfig.globalAddress || '',
    emergencyContact: siteConfig.emergencyContact || '',
    
    // Redes sociales
    facebookUrl: siteConfig.facebookUrl || '',
    twitterUrl: siteConfig.twitterUrl || '',
    linkedinUrl: siteConfig.linkedinUrl || '',
    instagramUrl: siteConfig.instagramUrl || '',
    youtubeUrl: siteConfig.youtubeUrl || '',
    
    // Sistema
    notFoundTitle: siteConfig.notFoundTitle || '',
    notFoundMessage: siteConfig.notFoundMessage || '',
    notFoundButton: siteConfig.notFoundButton || '',
    version: siteConfig.version || '1.0.0'
  });

  // Estado para enlaces de navegación
  const [navLinks, setNavLinks] = useState(() => {
    try {
      return siteConfig.mainNavLinks || [];
    } catch (e) {
      return [];
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          siteKeywords: formData.siteKeywords.split(',').map(k => k.trim()).filter(k => k),
          mainNavLinks: navLinks
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error updating site config:', error);
      alert('Error al actualizar la configuración');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addNavLink = () => {
    setNavLinks([...navLinks, { label: '', href: '' }]);
  };

  const removeNavLink = (index: number) => {
    setNavLinks(navLinks.filter((_, i) => i !== index));
  };

  const updateNavLink = (index: number, field: 'label' | 'href', value: string) => {
    const updated = [...navLinks];
    updated[index] = { ...updated[index], [field]: value };
    setNavLinks(updated);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'seo', label: 'SEO', icon: Eye },
    { id: 'branding', label: 'Branding', icon: Image },
    { id: 'colors', label: 'Colores', icon: Palette },
    { id: 'contact', label: 'Contacto', icon: MessageSquare },
    { id: 'navigation', label: 'Navegación', icon: Link },
    { id: 'system', label: 'Sistema', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Configuración del Sitio</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-3 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-[calc(90vh-120px)]">
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Información General</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Sitio
                    </label>
                    <input
                      type="text"
                      value={formData.siteName}
                      onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="CIIMED"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Principal
                    </label>
                    <input
                      type="url"
                      value={formData.siteUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, siteUrl: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="https://ciimed.pa"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del Sitio
                  </label>
                  <textarea
                    value={formData.siteDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Centro de Investigación e Innovación en Medicina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Palabras Clave (separadas por comas)
                  </label>
                  <input
                    type="text"
                    value={formData.siteKeywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteKeywords: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="medicina, investigación, salud, ciencia"
                  />
                </div>
              </div>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">SEO y Metadatos</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título SEO (aparece en el navegador)
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="CIIMED - Centro de Investigación e Innovación en Medicina"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción SEO
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Descripción que aparece en Google y redes sociales"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Imagen Open Graph (URL)
                    </label>
                    <input
                      type="url"
                      value={formData.ogImage}
                      onChange={(e) => setFormData(prev => ({ ...prev, ogImage: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción para Redes Sociales
                    </label>
                    <textarea
                      value={formData.ogDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, ogDescription: e.target.value }))}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Descripción específica para redes sociales"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Branding Tab */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Branding y Logos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo Principal (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.primaryLogo}
                      onChange={(e) => setFormData(prev => ({ ...prev, primaryLogo: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="/logo.png"
                    />
                    {formData.primaryLogo && (
                      <img 
                        src={formData.primaryLogo} 
                        alt="Preview" 
                        className="mt-2 h-12 w-auto"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo Secundario (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.secondaryLogo}
                      onChange={(e) => setFormData(prev => ({ ...prev, secondaryLogo: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="/logo_blanco.png"
                    />
                    {formData.secondaryLogo && (
                      <img 
                        src={formData.secondaryLogo} 
                        alt="Preview" 
                        className="mt-2 h-12 w-auto bg-gray-800 p-2 rounded"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Favicon (URL)
                    </label>
                    <input
                      type="text"
                      value={formData.favicon}
                      onChange={(e) => setFormData(prev => ({ ...prev, favicon: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="/favicon.ico"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Colores del Tema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: 'primaryColor', label: 'Color Primario', description: 'Color principal del sitio' },
                    { key: 'secondaryColor', label: 'Color Secundario', description: 'Color de acentos y botones' },
                    { key: 'accentColor', label: 'Color de Acento', description: 'Color para texto y elementos' },
                    { key: 'lightColor', label: 'Color Claro', description: 'Color de fondos claros' }
                  ].map((color) => (
                    <div key={color.key} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {color.label}
                      </label>
                      <p className="text-xs text-gray-500">{color.description}</p>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={formData[color.key as keyof typeof formData] as string}
                          onChange={(e) => setFormData(prev => ({ ...prev, [color.key]: e.target.value }))}
                          className="w-12 h-10 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={formData[color.key as keyof typeof formData] as string}
                          onChange={(e) => setFormData(prev => ({ ...prev, [color.key]: e.target.value }))}
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Información de Contacto Global</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Principal
                    </label>
                    <input
                      type="email"
                      value={formData.globalEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, globalEmail: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="info@ciimed.pa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono Principal
                    </label>
                    <input
                      type="tel"
                      value={formData.globalPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, globalPhone: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="+507 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección Principal
                  </label>
                  <textarea
                    value={formData.globalAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, globalAddress: e.target.value }))}
                    rows={2}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Ciudad de la Salud, Panamá"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contacto de Emergencia (opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Contacto especial para emergencias"
                  />
                </div>
                
                <h4 className="text-md font-medium text-gray-900 mt-8">Redes Sociales</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'facebookUrl', label: 'Facebook', placeholder: 'https://facebook.com/ciimed' },
                    { key: 'twitterUrl', label: 'Twitter/X', placeholder: 'https://twitter.com/ciimed' },
                    { key: 'linkedinUrl', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/ciimed' },
                    { key: 'instagramUrl', label: 'Instagram', placeholder: 'https://instagram.com/ciimed' },
                    { key: 'youtubeUrl', label: 'YouTube', placeholder: 'https://youtube.com/@ciimed' }
                  ].map((social) => (
                    <div key={social.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {social.label}
                      </label>
                      <input
                        type="url"
                        value={formData[social.key as keyof typeof formData] as string}
                        onChange={(e) => setFormData(prev => ({ ...prev, [social.key]: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder={social.placeholder}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Tab */}
            {activeTab === 'navigation' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Enlaces de Navegación Principal</h3>
                  <button
                    type="button"
                    onClick={addNavLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Agregar Enlace
                  </button>
                </div>
                <div className="space-y-4">
                  {navLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateNavLink(index, 'label', e.target.value)}
                          placeholder="Texto del enlace"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2"
                        />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => updateNavLink(index, 'href', e.target.value)}
                          placeholder="/ruta-del-enlace"
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNavLink(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Mensajes del Sistema</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título de Página 404
                    </label>
                    <input
                      type="text"
                      value={formData.notFoundTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, notFoundTitle: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Página no encontrada"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje de Página 404
                    </label>
                    <textarea
                      value={formData.notFoundMessage}
                      onChange={(e) => setFormData(prev => ({ ...prev, notFoundMessage: e.target.value }))}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="No se pudo encontrar el recurso solicitado."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Texto del Botón 404
                    </label>
                    <input
                      type="text"
                      value={formData.notFoundButton}
                      onChange={(e) => setFormData(prev => ({ ...prev, notFoundButton: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Volver a la página principal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Versión de Configuración
                    </label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="1.0.0"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Configuración
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}