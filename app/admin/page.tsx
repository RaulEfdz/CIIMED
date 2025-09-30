'use client'

import { useRouter } from 'next/navigation'
import ProtectedRoute from './components/ProtectedRoute'
import { Bot, Settings, FileText, BarChart3 } from 'lucide-react'

export default function AdminPanel() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
                <p className="text-gray-600">Centro de control CIIMED</p>
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
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido al Panel de Administración</h2>
            <p className="text-gray-600">Gestiona los diferentes módulos del sistema CIIMED desde aquí.</p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Chatbot Module */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
                 onClick={() => router.push('/admin/chatbot')}>
              <div className="flex items-center mb-4">
                <Bot className="h-8 w-8 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900 ml-3">Gestión del Chatbot</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Administra documentos, embeddings y el conocimiento del sistema RAG del chatbot.
              </p>
              <div className="flex items-center text-emerald-600 font-medium">
                <span>Acceder</span>
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Analytics Module */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer opacity-50">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900 ml-3">Analíticas</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Estadísticas de uso, conversaciones y rendimiento del chatbot.
              </p>
              <div className="flex items-center text-gray-400 font-medium">
                <span>Próximamente</span>
              </div>
            </div>

            {/* Content Management */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
                 onClick={() => router.push('/admin/content')}>
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900 ml-3">Gestión de Contenido</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Administra el contenido del sitio web, noticias y publicaciones.
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                <span>Acceder</span>
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer opacity-50">
              <div className="flex items-center mb-4">
                <Settings className="h-8 w-8 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900 ml-3">Configuración</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Configuración general del sistema, usuarios y permisos.
              </p>
              <div className="flex items-center text-gray-400 font-medium">
                <span>Próximamente</span>
              </div>
            </div>

          </div>

          {/* Quick Info */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Versión del Sistema</p>
                <p className="text-lg font-semibold text-gray-900">v1.0.0</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Actualización</p>
                <p className="text-lg font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado del Sistema</p>
                <p className="text-lg font-semibold text-green-600">Operativo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}