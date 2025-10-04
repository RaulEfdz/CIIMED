'use client'

import React from 'react'
import Link from 'next/link'
import { ExternalLink, Home, ArrowRight } from 'lucide-react'
import { getPublicSectionsForAdmin } from '../../config/sections-mapping'

interface NavigationHelperProps {
  currentSection?: string
  showPublicLinks?: boolean
}

export const NavigationHelper: React.FC<NavigationHelperProps> = ({ 
  currentSection, 
  showPublicLinks = true 
}) => {
  const publicSections = currentSection ? getPublicSectionsForAdmin(currentSection) : []

  if (!showPublicLinks || publicSections.length === 0) {
    return null
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Vista previa en el sitio público
          </h3>
          <div className="flex flex-wrap gap-2">
            {publicSections.map((section, index) => (
              <Link
                key={index}
                href={section.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded-md transition-colors"
              >
                <Home className="h-3 w-3 mr-1" />
                {section.label}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Link>
            ))}
          </div>
        </div>
        <div className="text-xs text-blue-600">
          Ver contenido aplicado
        </div>
      </div>
    </div>
  )
}

interface AdminBreadcrumbProps {
  items: { label: string; href?: string }[]
}

export const AdminBreadcrumb: React.FC<AdminBreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <Link href="/admin" className="hover:text-gray-700">
        Panel Admin
      </Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ArrowRight className="h-3 w-3" />
          {item.href ? (
            <Link href={item.href} className="hover:text-gray-700">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-900">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

export default NavigationHelper