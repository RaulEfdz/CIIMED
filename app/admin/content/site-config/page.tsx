'use client'

import { useState, useEffect } from 'react';
import { Settings, Edit, Save, Eye, Globe, Palette, Image, Link, MessageSquare } from 'lucide-react';
import { useSiteConfig, SiteConfig } from '@/hooks/useSiteConfig';
import EditSiteConfigModal from './components/EditSiteConfigModal';

export default function SiteConfigPage() {
  const { siteConfig, isLoading, error, fetchSiteConfig } = useSiteConfig();
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchSiteConfig();
  }, [fetchSiteConfig]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Settings className="h-8 w-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Configuración del Sitio</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="ml-3 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchSiteConfig}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Settings className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configuración del Sitio</h1>
            <p className="text-gray-600">Gestiona la configuración general, metadatos, branding y navegación</p>
          </div>
        </div>
        <button
          onClick={() => setShowEditModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center"
        >
          <Edit className="h-5 w-5 mr-2" />
          Editar Configuración
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Globe className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Sitio Web</p>
              <p className="text-lg font-semibold">{siteConfig?.siteName || 'Sin configurar'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Link className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Enlaces Nav</p>
              <p className="text-lg font-semibold">{siteConfig?.mainNavLinks ? JSON.parse(siteConfig.mainNavLinks as string).length : 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <Palette className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Tema</p>
              <div className="flex items-center mt-1">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: siteConfig?.primaryColor || '#285C4D' }}
                ></div>
                <p className="text-sm">{siteConfig?.primaryColor || '#285C4D'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Última Act.</p>
              <p className="text-lg font-semibold">
                {siteConfig?.updatedAt ? new Date(siteConfig.updatedAt).toLocaleDateString('es-ES') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Información General */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Información General
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Sitio</label>
                <p className="mt-1 text-sm text-gray-900">{siteConfig?.siteName || 'Sin configurar'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <p className="mt-1 text-sm text-gray-900">{siteConfig?.siteDescription || 'Sin configurar'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">URL Principal</label>
                <p className="mt-1 text-sm text-gray-900">{siteConfig?.siteUrl || 'Sin configurar'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Palabras Clave</label>
                <p className="mt-1 text-sm text-gray-900">
                  {siteConfig?.siteKeywords?.join(', ') || 'Sin configurar'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO y Metadatos */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              SEO y Metadatos
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título SEO</label>
                <p className="mt-1 text-sm text-gray-900">{siteConfig?.metaTitle || 'Sin configurar'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción SEO</label>
                <p className="mt-1 text-sm text-gray-900 line-clamp-2">{siteConfig?.metaDescription || 'Sin configurar'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Imagen Open Graph</label>
                <p className="mt-1 text-sm text-gray-900">{siteConfig?.ogImage || 'Sin configurar'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Image className="h-5 w-5 mr-2" />
              Branding
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo Principal</label>
                  {siteConfig?.primaryLogo && (
                    <img 
                      src={siteConfig.primaryLogo} 
                      alt="Logo principal" 
                      className="mt-2 h-12 w-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <p className="mt-1 text-xs text-gray-500">{siteConfig?.primaryLogo || 'Sin configurar'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo Secundario</label>
                  {siteConfig?.secondaryLogo && (
                    <img 
                      src={siteConfig.secondaryLogo} 
                      alt="Logo secundario" 
                      className="mt-2 h-12 w-auto bg-gray-800 p-2 rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <p className="mt-1 text-xs text-gray-500">{siteConfig?.secondaryLogo || 'Sin configurar'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colores del Tema */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Colores del Tema
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full border border-gray-300" 
                  style={{ backgroundColor: siteConfig?.primaryColor || '#285C4D' }}
                ></div>
                <div>
                  <p className="text-sm font-medium">Primario</p>
                  <p className="text-xs text-gray-500">{siteConfig?.primaryColor || '#285C4D'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full border border-gray-300" 
                  style={{ backgroundColor: siteConfig?.secondaryColor || '#F4633A' }}
                ></div>
                <div>
                  <p className="text-sm font-medium">Secundario</p>
                  <p className="text-xs text-gray-500">{siteConfig?.secondaryColor || '#F4633A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full border border-gray-300" 
                  style={{ backgroundColor: siteConfig?.accentColor || '#212322' }}
                ></div>
                <div>
                  <p className="text-sm font-medium">Acento</p>
                  <p className="text-xs text-gray-500">{siteConfig?.accentColor || '#212322'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-full border border-gray-300" 
                  style={{ backgroundColor: siteConfig?.lightColor || '#f2f2f2' }}
                ></div>
                <div>
                  <p className="text-sm font-medium">Claro</p>
                  <p className="text-xs text-gray-500">{siteConfig?.lightColor || '#f2f2f2'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contacto Global */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Contacto Global
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Principal</label>
                <p className="mt-1 text-sm text-gray-900">{siteConfig?.globalEmail || 'Sin configurar'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono Principal</label>
                <p className="mt-1 text-sm text-gray-900">{siteConfig?.globalPhone || 'Sin configurar'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <p className="mt-1 text-sm text-gray-900">{siteConfig?.globalAddress || 'Sin configurar'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <div className="bg-white shadow rounded-lg lg:col-span-2">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Link className="h-5 w-5 mr-2" />
              Enlaces de Navegación Principal
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {siteConfig?.mainNavLinks && JSON.parse(siteConfig.mainNavLinks as string).map((link: any, index: number) => (
                <div key={index} className="flex items-center p-3 border border-gray-200 rounded-md">
                  <Link className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{link.label}</p>
                    <p className="text-xs text-gray-500">{link.href}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {showEditModal && siteConfig && (
        <EditSiteConfigModal 
          siteConfig={siteConfig}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            fetchSiteConfig();
          }}
        />
      )}
    </div>
  );
}