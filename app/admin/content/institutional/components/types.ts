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
  achievementResearchValue?: string
  achievementResearchDesc?: string
  achievementPatientsValue?: string
  achievementPatientsDesc?: string
  achievementPublicationsValue?: string
  achievementPublicationsDesc?: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface ModalProps {
  onClose: () => void
  onSuccess: () => void
  setInstitutionalInfo: React.Dispatch<React.SetStateAction<InstitutionalInfo | null>>
}

export interface EditModalProps extends ModalProps {
  info: InstitutionalInfo
}