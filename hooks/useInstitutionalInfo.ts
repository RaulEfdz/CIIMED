import { useState, useEffect } from 'react'

export interface InstitutionalInfo {
  id: string
  name: string
  description: string
  subtitle?: string
  mission: string
  vision: string
  values: string[]
  history?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  foundingYear: number
  logo?: string
  image?: string
  heroImage?: string
  historyImage?: string
  instagramUrl?: string
  linkedinUrl?: string
  youtubeUrl?: string
  spotifyUrl?: string
  feature1Title?: string
  feature1Text?: string
  feature2Title?: string
  feature2Text?: string
  overlayColor?: string
  footerBrand?: string
  footerEmail?: string
  footerPhone?: string
  footerAddress?: string
  footerCopyright?: string
  footerBackgroundColor?: string
  footerTextColor?: string
  footerAccentColor?: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export const useInstitutionalInfo = () => {
  const [institutionalInfo, setInstitutionalInfo] = useState<InstitutionalInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInstitutionalInfo = async (retryCount = 0) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/institutional')
      
      if (!response.ok) {
        // Si es un error 500 y es el primer intento, reintenta una vez más
        if (response.status === 500 && retryCount === 0) {
          console.warn('Institutional API returned 500, retrying once...');
          await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
          return fetchInstitutionalInfo(1);
        }
        throw new Error(`Failed to fetch institutional info: ${response.status}`)
      }
      
      const data = await response.json()
      setInstitutionalInfo(data.institutionalInfo)
    } catch (err) {
      console.error('Error fetching institutional info:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setInstitutionalInfo(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInstitutionalInfo()
  }, [])

  return {
    institutionalInfo,
    isLoading,
    error,
    refetch: fetchInstitutionalInfo
  }
}

// Función auxiliar para obtener estadísticas dinámicas
export const getAchievementsFromInstitutional = (info: InstitutionalInfo | null) => {
  if (!info) return []
  
  return [
    {
      icon: 'FlaskConical',
      title: 'Investigaciones',
      value: '150+', // Este valor podría venir de otra API en el futuro
      description: 'Proyectos de investigación completados',
    },
    {
      icon: 'Users',
      title: 'Pacientes',
      value: '10000+', // Este valor podría venir de otra API en el futuro
      description: 'Personas beneficiadas',
    },
    {
      icon: 'GraduationCap',
      title: 'Publicaciones',
      value: '75+', // Este valor podría venir de otra API en el futuro
      description: 'Artículos científicos publicados',
    },
  ]
}

// Función auxiliar para obtener features dinámicos
export const getFeaturesFromInstitutional = (info: InstitutionalInfo | null) => {
  if (!info) return []
  
  // Usar imagen específica para "Nuestra Información" o fallback
  const defaultImage = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";
  
  return [
    {
      id: '1',
      title: 'Misión',
      description: info.mission,
      icon: 'HeartPulse',
      imageUrl: info.image || defaultImage,
    },
    {
      id: '2',
      title: 'Visión',
      description: info.vision,
      icon: 'Dna',
      imageUrl: info.image || defaultImage,
    },
  ]
}

// Función auxiliar para obtener datos del hero dinámicos
export const getHeroDataFromInstitutional = (info: InstitutionalInfo | null) => {
  if (!info) return null
  
  const defaultHeroImage = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80";
  
  return {
    title: 'Sobre Nosotros',
    subtitle: info.description,
    imageUrl: info.heroImage || defaultHeroImage,
    primaryButton: { text: 'Comenzar ahora', link: '#', disabled: true },
    secondaryButton: { text: 'Ver tour', link: '#', disabled: true },
    overlayColor: info.overlayColor || '#285C4D',
    highlight: '/highlights/Nosotros.png',
  }
}

// Función auxiliar para obtener datos de historia dinámicos
export const getHistoryDataFromInstitutional = (info: InstitutionalInfo | null) => {
  if (!info) return null
  
  return {
    description: info.history || 'Historia del Centro de Investigación e Innovación Médica.',
    objectives: [
      'Proporcionar un entorno propicio para que médicos y científicos desarrollen proyectos de investigación que beneficien a la comunidad local e internacional.',
      'Fortalecer la capacidad investigativa en el país, especialmente en áreas críticas como enfermedades crónicas y salud pública.',
    ],
  }
}