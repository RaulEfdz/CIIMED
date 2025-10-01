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