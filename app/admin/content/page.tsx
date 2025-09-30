'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../components/ProtectedRoute'
import { 
  FileText, 
  Users, 
  Building2, 
  Newspaper, 
  Image, 
  Settings,
  ArrowLeft,
  Plus,
  Eye,
  Edit,
  Calendar
} from 'lucide-react'

export default function ContentManagement() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const contentSections = [
    {
      id: 'team',
      title: 'Equipo de Trabajo',
      description: 'Gestionar staff, investigadores y personal del CIIMED',
      icon: Users,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700',
      items: 3,
      status: 'Disponible'
    },
    {
      id: 'institutional',
      title: 'Información Institucional',
      description: 'Datos sobre el centro, misión, visión y valores',
      icon: Building2,
      color: 'bg-emerald-600',
      hoverColor: 'hover:bg-emerald-700',
      items: 0,
      status: 'Disponible'
    },
    {
      id: 'news',
      title: 'Noticias y Publicaciones',
      description: 'Artículos, noticias y comunicados del CIIMED',
      icon: Newspaper,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700',
      items: 0,
      status: 'Próximamente'
    },
    {
      id: 'research',
      title: 'Proyectos de Investigación',
      description: 'Gestionar líneas de investigación y proyectos activos',
      icon: FileText,
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700',
      items: 0,
      status: 'Próximamente'
    },
    {
      id: 'media',
      title: 'Galería de Medios',
      description: 'Imágenes, videos y recursos multimedia',
      icon: Image,
      color: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700',
      items: 0,
      status: 'Próximamente'
    },
    {
      id: 'settings',
      title: 'Configuración del Sitio',
      description: 'Configuraciones generales y metadatos',
      icon: Settings,
      color: 'bg-gray-600',
      hoverColor: 'hover:bg-gray-700',
      items: 0,
      status: 'Próximamente'
    }
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/admin')}
                  className="mr-4 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Contenido
                  </h1>
                  <p className="text-gray-600">Administra el contenido del sitio web, noticias y publicaciones</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Personal</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <Newspaper className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Noticias</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Proyectos</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-pink-100">
                  <Image className="h-6 w-6 text-pink-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Medios</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentSections.map((section) => {
              const IconComponent = section.icon
              return (
                <div
                  key={section.id}
                  className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${section.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        section.status === 'Disponible' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {section.status}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {section.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{section.items} elementos</span>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Actualizado hoy</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {(section.id === 'team' || section.id === 'institutional') ? (
                        <>
                          <button
                            onClick={() => router.push(`/admin/content/${section.id}`)}
                            className={`flex-1 ${section.color} ${section.hoverColor} text-white px-3 py-2 rounded-md text-sm flex items-center justify-center`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </button>
                          <button
                            onClick={() => router.push(`/admin/content/${section.id}`)}
                            className={`flex-1 ${section.color} ${section.hoverColor} text-white px-3 py-2 rounded-md text-sm flex items-center justify-center`}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Gestionar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            disabled
                            className="flex-1 bg-gray-300 text-gray-500 px-3 py-2 rounded-md text-sm flex items-center justify-center cursor-not-allowed"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </button>
                          <button
                            disabled
                            className="flex-1 bg-gray-300 text-gray-500 px-3 py-2 rounded-md text-sm flex items-center justify-center cursor-not-allowed"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Gestionar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}