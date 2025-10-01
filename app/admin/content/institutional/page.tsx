'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '../../components/ProtectedRoute'
import { 
  Building2, 
  Edit, 
  Eye,
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Target,
  Lightbulb,
  Heart,
  Palette,
  Copyright,
  TrendingUp
} from 'lucide-react'

import { InstitutionalInfo } from './components/types'
import EditInstitutionalModal from './components/EditInstitutionalModal'
import EditFooterModal from './components/EditFooterModal'
import AboutMultimediaPreview from './components/AboutMultimediaPreview'
import EditImageModal from './components/EditImageModal'
import EditAchievementsModal from './components/EditAchievementsModal'
import DatabaseStatus from '@/components/admin/DatabaseStatus'
import SafeImage from '@/components/admin/SafeImage'

export default function InstitutionalManagement() {
  const router = useRouter()
  const [institutionalInfo, setInstitutionalInfo] = useState<InstitutionalInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showFooterModal, setShowFooterModal] = useState(false)
  const [showAchievementsModal, setShowAchievementsModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState<'logo' | 'heroImage' | 'image' | 'historyImage' | null>(null)

  useEffect(() => {
    fetchInstitutionalInfo()
  }, [])

  const fetchInstitutionalInfo = async () => {
    try {
      const response = await fetch('/api/institutional')
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error ${response.status}:`, errorText)
        throw new Error(`Failed to fetch institutional info: ${response.status} "${response.statusText}"`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data && data.institutionalInfo) {
        setInstitutionalInfo(data.institutionalInfo)
      } else {
        console.log('No institutional info found in API response')
        setInstitutionalInfo(null)
      }
    } catch (error) {
      console.error('Error fetching institutional info:', error)
      setInstitutionalInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleCreateInitial = async () => {
    try {
      const response = await fetch('/api/institutional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'CIIMED | Centro de Investigación e Innovación Médica',
          description: 'Un referente en investigación y desarrollo en salud en Panamá',
          subtitle: 'Un referente en investigación y desarrollo en salud en Panamá',
          mission: 'Promover la investigación e innovación médica en Panamá para mejorar la salud de la población.',
          vision: 'Ser el centro de referencia en investigación médica en Centroamérica.',
          values: ['Excelencia', 'Integridad', 'Innovación', 'Colaboración'],
          history: 'El Centro de Investigación e Innovación Médica es una iniciativa clave en Panamá, ubicada en la Ciudad de la Salud.',
          address: 'Ciudad de la Salud, Panamá',
          phone: '',
          email: 'info@ciimed.pa',
          website: 'https://ciimed.pa',
          foundingYear: 2020,
          instagramUrl: 'https://www.instagram.com/ciimedpanama/',
          linkedinUrl: 'https://www.linkedin.com/company/ciimed/posts/?feedView=all',
          youtubeUrl: 'https://www.youtube.com/channel/UCw525jjoG_HssaCxp4XJRow',
          spotifyUrl: 'https://open.spotify.com/show/6rPGtfqkc8iOK80k6KtyHD',
          feature1Title: 'Investigación Avanzada',
          feature1Text: 'El centro está enfocado en el estudio de nuevas tecnologías, medicamentos, vacunas y dispositivos médicos.',
          feature2Title: 'Colaboraciones Estratégicas',
          feature2Text: 'Trabaja de manera conjunta con instituciones como la Secretaría Nacional de Ciencia, Tecnología e Innovación (SENACYT).',
          overlayColor: '#ffffff',
          footerBrand: 'CIIMED',
          footerEmail: 'info@ciimed.pa',
          footerPhone: '+507 123-4567',
          footerAddress: 'Ciudad de la Salud, Panamá',
          footerCopyright: '© 2024 CIIMED. Todos los derechos reservados.',
          footerBackgroundColor: '#285C4D',
          footerTextColor: '#ffffff',
          footerAccentColor: '#F4633A'
        })
      })

      if (response.ok) {
        const result = await response.json()
        setInstitutionalInfo(result.institutionalInfo)
      } else {
        console.error('Error creating initial institutional info')
      }
    } catch (error) {
      console.error('Error creating initial institutional info:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <button
                  onClick={() => router.push('/admin/content')}
                  className="mr-4 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Información Institucional
                  </h1>
                  <p className="text-gray-600">Datos sobre el centro, misión, visión y valores</p>
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
          {/* Database Status */}
          <DatabaseStatus />
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="ml-3 text-gray-600">Cargando información...</p>
            </div>
          ) : institutionalInfo ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Institución</p>
                      <p className="text-lg font-bold text-gray-900">{institutionalInfo.name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Fundado en</p>
                      <p className="text-2xl font-bold text-gray-900">{institutionalInfo.foundingYear}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <Heart className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Valores</p>
                      <p className="text-2xl font-bold text-gray-900">{institutionalInfo.values.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center">
                    <div className={`h-3 w-3 rounded-full ${institutionalInfo.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'} mr-3`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Estado</p>
                      <p className="text-lg font-bold text-gray-900 capitalize">{institutionalInfo.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Information Card */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Información General
                  </h3>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Logo */}
                      {institutionalInfo.logo && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Logo</h4>
                            <button
                              onClick={() => setShowImageModal('logo')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center"
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </button>
                          </div>
                          <SafeImage 
                            src={institutionalInfo.logo} 
                            alt="Logo institucional"
                            width={128}
                            height={128}
                            className="w-32 h-32 object-contain border border-gray-200 rounded-lg"
                          />
                        </div>
                      )}

                      {/* Basic Info */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Información Básica</h4>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building2 className="h-4 w-4 mr-2" />
                            <span className="font-medium">Nombre:</span>
                            <span className="ml-2">{institutionalInfo.name}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="font-medium">Fundado en:</span>
                            <span className="ml-2">{institutionalInfo.foundingYear}</span>
                          </div>

                          {institutionalInfo.address && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span className="font-medium">Dirección:</span>
                              <span className="ml-2">{institutionalInfo.address}</span>
                            </div>
                          )}

                          {institutionalInfo.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2" />
                              <span className="font-medium">Teléfono:</span>
                              <span className="ml-2">{institutionalInfo.phone}</span>
                            </div>
                          )}

                          {institutionalInfo.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-2" />
                              <span className="font-medium">Email:</span>
                              <a 
                                href={`mailto:${institutionalInfo.email}`}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                {institutionalInfo.email}
                              </a>
                            </div>
                          )}

                          {institutionalInfo.website && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Globe className="h-4 w-4 mr-2" />
                              <span className="font-medium">Website:</span>
                              <a 
                                href={institutionalInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                {institutionalInfo.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Values */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          Valores
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {institutionalInfo.values.map((value, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-full"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Main Image */}
                      {institutionalInfo.image && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Imagen Principal</h4>
                          <SafeImage 
                            src={institutionalInfo.image} 
                            alt="Imagen institucional"
                            width={600}
                            height={192}
                            className="w-full h-48 object-cover border border-gray-200 rounded-lg"
                          />
                        </div>
                      )}

                      {/* Description */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Descripción</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{institutionalInfo.description}</p>
                      </div>

                      {/* Mission */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Misión
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{institutionalInfo.mission}</p>
                      </div>

                      {/* Vision */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Lightbulb className="h-4 w-4 mr-2" />
                          Visión
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{institutionalInfo.vision}</p>
                      </div>

                      {/* History */}
                      {institutionalInfo.history && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Historia</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{institutionalInfo.history}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Multimedia Preview Card */}
              <div className="mt-8">
                <AboutMultimediaPreview 
                  info={institutionalInfo} 
                  onEditImage={(imageType) => setShowImageModal(imageType)}
                />
              </div>

              {/* Achievements Statistics Card */}
              <div className="bg-white shadow rounded-lg mt-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Estadísticas de Logros
                  </h3>
                  <button
                    onClick={() => setShowAchievementsModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {institutionalInfo?.achievementResearchValue || '150+'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {institutionalInfo?.achievementResearchDesc || 'Proyectos de investigación completados'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {institutionalInfo?.achievementPatientsValue || '10000+'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {institutionalInfo?.achievementPatientsDesc || 'Personas beneficiadas'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {institutionalInfo?.achievementPublicationsValue || '75+'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {institutionalInfo?.achievementPublicationsDesc || 'Artículos científicos publicados'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Configuration Card */}
              <div className="bg-white shadow rounded-lg mt-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Configuración del Footer
                  </h3>
                  <button
                    onClick={() => setShowFooterModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Contact Info */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Información de Contacto</h4>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building2 className="h-4 w-4 mr-2" />
                            <span className="font-medium">Marca:</span>
                            <span className="ml-2">{institutionalInfo.footerBrand || institutionalInfo.name || 'CIIMED'}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span className="font-medium">Email:</span>
                            <span className="ml-2">{institutionalInfo.footerEmail || institutionalInfo.email || 'info@ciimed.pa'}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span className="font-medium">Teléfono:</span>
                            <span className="ml-2">{institutionalInfo.footerPhone || institutionalInfo.phone || '+507 123-4567'}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="font-medium">Dirección:</span>
                            <span className="ml-2">{institutionalInfo.footerAddress || institutionalInfo.address || 'Ciudad de la Salud, Panamá'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Copyright */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <Copyright className="h-4 w-4 mr-2" />
                          Copyright
                        </h4>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {institutionalInfo.footerCopyright || `© ${new Date().getFullYear()} ${institutionalInfo.name || 'CIIMED'}. Todos los derechos reservados.`}
                        </p>
                      </div>
                    </div>

                    {/* Right Column - Colors */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Configuración de Colores</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-sm text-gray-600">Color de Fondo</span>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: institutionalInfo.footerBackgroundColor || '#285C4D' }}
                              ></div>
                              <span className="text-sm font-mono text-gray-700">
                                {institutionalInfo.footerBackgroundColor || '#285C4D'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-sm text-gray-600">Color del Texto</span>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: institutionalInfo.footerTextColor || '#ffffff' }}
                              ></div>
                              <span className="text-sm font-mono text-gray-700">
                                {institutionalInfo.footerTextColor || '#ffffff'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-sm text-gray-600">Color de Acento</span>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{ backgroundColor: institutionalInfo.footerAccentColor || '#F4633A' }}
                              ></div>
                              <span className="text-sm font-mono text-gray-700">
                                {institutionalInfo.footerAccentColor || '#F4633A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Vista Previa</h4>
                        <div 
                          className="p-4 rounded-md border"
                          style={{ 
                            backgroundColor: institutionalInfo.footerBackgroundColor || '#285C4D',
                            color: institutionalInfo.footerTextColor || '#ffffff'
                          }}
                        >
                          <div className="text-sm font-semibold mb-2">
                            {institutionalInfo.footerBrand || institutionalInfo.name || 'CIIMED'}
                          </div>
                          <div className="text-xs space-y-1">
                            <div className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" style={{ color: institutionalInfo.footerAccentColor || '#F4633A' }} />
                              {institutionalInfo.footerEmail || institutionalInfo.email || 'info@ciimed.pa'}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" style={{ color: institutionalInfo.footerAccentColor || '#F4633A' }} />
                              {institutionalInfo.footerPhone || institutionalInfo.phone || '+507 123-4567'}
                            </div>
                            <div className="text-xs opacity-70 mt-2">
                              {institutionalInfo.footerCopyright || `© ${new Date().getFullYear()} ${institutionalInfo.name || 'CIIMED'}. Todos los derechos reservados.`}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* No Data State */
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay información institucional</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comienza creando la información básica de tu institución.
              </p>
              <div className="mt-6">
                <button
                  onClick={handleCreateInitial}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Crear Información Institucional
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {showEditModal && institutionalInfo && (
          <EditInstitutionalModal 
            info={institutionalInfo}
            onClose={() => setShowEditModal(false)}
            onSuccess={() => {
              setShowEditModal(false)
              fetchInstitutionalInfo()
            }}
            setInstitutionalInfo={setInstitutionalInfo}
          />
        )}

        {/* Footer Modal */}
        {showFooterModal && institutionalInfo && (
          <EditFooterModal 
            info={institutionalInfo}
            onClose={() => setShowFooterModal(false)}
            onSuccess={() => {
              setShowFooterModal(false)
              fetchInstitutionalInfo()
            }}
            setInstitutionalInfo={setInstitutionalInfo}
          />
        )}

        {/* Achievements Modal */}
        {showAchievementsModal && institutionalInfo && (
          <EditAchievementsModal 
            info={institutionalInfo}
            onClose={() => setShowAchievementsModal(false)}
            onSuccess={() => {
              setShowAchievementsModal(false)
              fetchInstitutionalInfo()
            }}
            setInstitutionalInfo={setInstitutionalInfo}
          />
        )}

        {/* Image Modal */}
        {showImageModal && institutionalInfo && (
          <EditImageModal 
            info={institutionalInfo}
            imageType={showImageModal}
            onClose={() => setShowImageModal(null)}
            onSuccess={() => {
              setShowImageModal(null)
              fetchInstitutionalInfo()
            }}
            setInstitutionalInfo={setInstitutionalInfo}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}