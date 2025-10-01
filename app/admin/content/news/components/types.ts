import { News } from '@/hooks/useNews'

export interface ModalProps {
  onClose: () => void
  onSuccess: () => void
  setNews: React.Dispatch<React.SetStateAction<News[]>>
}

export interface EditNewsModalProps extends ModalProps {
  news: News
}

export interface AddNewsModalProps extends ModalProps {
  // Propiedades específicas para agregar noticias si las necesitamos
}