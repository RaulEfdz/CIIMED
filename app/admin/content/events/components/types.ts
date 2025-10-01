import { Event } from '@/hooks/useEvents'

export interface ModalProps {
  onClose: () => void
  onSuccess: () => void
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
}

export interface EditEventModalProps extends ModalProps {
  event: Event
}

export interface AddEventModalProps extends ModalProps {
  // Propiedades específicas para agregar eventos si las necesitamos
}