'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, Edit, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { getAdminSectionsForPublic, publicToAdminMapping } from '../../config/sections-mapping'

interface QuickAdminAccessProps {
  className?: string
  isAuthenticated?: boolean
}

export const QuickAdminAccess: React.FC<QuickAdminAccessProps> = ({ 
  className = "",
  isAuthenticated = false 
}) => {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)

  // Encontrar la sección pública actual
  const currentPublicSection = publicToAdminMapping.find(section => 
    section.href === pathname
  )

  // Obtener secciones administrativas relacionadas
  const adminSections = currentPublicSection ? 
    getAdminSectionsForPublic(currentPublicSection.id) : []

  // No mostrar si no hay secciones relacionadas o no está autenticado
  if (!isAuthenticated || adminSections.length === 0) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Botón principal */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex items-center">
            <Settings className="h-4 w-4 mr-2 text-blue-600" />
            <span className="font-medium">Editar esta página</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-400" />
          )}
        </button>

        {/* Opciones expandidas */}
        {isExpanded && (
          <div className="border-t border-gray-100">
            <div className="p-2 space-y-1">
              {adminSections.map((section, index) => (
                <Link
                  key={index}
                  href={`/admin/content/${section.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full p-2 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-700 rounded transition-colors"
                >
                  <Edit className="h-3 w-3 mr-2" />
                  <span className="flex-1">{section.title}</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              ))}
              
              {/* Enlace al panel principal */}
              <div className="pt-2 mt-2 border-t border-gray-100">
                <Link
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center w-full p-2 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded transition-colors"
                >
                  <Settings className="h-3 w-3 mr-2" />
                  <span className="flex-1">Panel de Administración</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuickAdminAccess