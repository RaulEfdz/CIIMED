export interface ChatMessage {
    id: string;
    sender: 'user' | 'bot';
    message: string;
    timestamp: number;
  }
  export interface FloatingIconProps {
    onClick: () => void;
    position?: 'left' | 'right';
    initialPosition?: { x: number, y: number }; // Nueva prop
    onPositionChange?: (position: { x: number, y: number }) => void; // Nueva prop
  }
  export interface ChatBoxProps {
    onClose: () => void;
    initialPosition?: { x: number, y: number }; // Nueva prop
    onPositionChange?: (position: { x: number, y: number }) => void; // Nueva prop
  }