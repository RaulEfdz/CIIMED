export interface TeamMember {
  id: string
  name: string
  position: string
  department: string
  email?: string
  phone?: string
  bio?: string
  avatar?: string
  linkedIn?: string
  website?: string
  specialties: string[]
  status: 'active' | 'inactive'
  joinDate: string
  type: 'researcher' | 'staff' | 'director' | 'admin'
}

export interface ModalProps {
  onClose: () => void
  onSuccess: () => void
  setTeamMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>
}

export interface EditModalProps extends ModalProps {
  member: TeamMember
}

export interface ImportModalProps {
  onClose: () => void
  onSuccess: () => void
}