// "use client";
import { useState, useEffect } from "react";

export interface Position {
  x: number;
  y: number;
}

export interface UsePositionsReturn {
  buttonPosition: Position;
  chatPosition: Position;
  handleButtonPositionChange: (pos: Position) => void;
  handleChatPositionChange: (pos: Position) => void;
}

// Función para mapear la posición textual a coordenadas
const getDefaultPosition = (alignment: string): Position => {
  const margin = 20;
  
  // Check if window is defined (client-side only)
  if (typeof window === "undefined") {
    return { x: 0, y: 0 }; // Fallback value during SSR
  }
  
  switch (alignment.toUpperCase()) {
    case "TL":
      return { x: margin, y: margin };
    case "TR":
      return { x: window.innerWidth - margin - 400, y: margin };
    case "BL":
      return { x: margin, y: window.innerHeight - margin - 400 };
    case "BR":
      return { x: window.innerWidth - margin - 100, y: window.innerHeight - margin - 100 };
    case "CENTER":
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    default:
      return { x: window.innerWidth - margin - 100, y: margin };
  }
};

const usePositions = (
  sharedPositions: boolean,
  defaultAlignment: string
): UsePositionsReturn => {
  const [buttonPosition, setButtonPosition] = useState<Position>(getDefaultPosition(defaultAlignment) || { x: 0, y: 0 });
  const [chatPosition, setChatPosition] = useState<Position>(getDefaultPosition(defaultAlignment) || { x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const defaultPos = defaultAlignment
      ? getDefaultPosition(defaultAlignment)
      : { x: window.innerWidth - 100, y: window.innerHeight - 100 };

    if (sharedPositions) {
      // Cargar posición compartida
      const savedShared = localStorage.getItem("robotipa-shared-position");
      if (savedShared) {
        const pos = JSON.parse(savedShared);
        setButtonPosition(pos);
        setChatPosition(pos);
      } else {
        setButtonPosition(defaultPos);
        setChatPosition(defaultPos);
      }
    } else {
      // Cargar posiciones separadas
      const savedButtonPos = localStorage.getItem("robotipa-button-position");
      const savedChatPos = localStorage.getItem("robotipa-chat-position");
      setButtonPosition(
        savedButtonPos ? JSON.parse(savedButtonPos) : defaultPos
      );
      setChatPosition(
        savedChatPos ? JSON.parse(savedChatPos) : defaultPos
      );
    }
  }, [sharedPositions, defaultAlignment]);

  const handleButtonPositionChange = (newPos: Position) => {
    if (isMounted) {
      setButtonPosition(newPos);
      if (sharedPositions) {
        setChatPosition(newPos);
        localStorage.setItem("robotipa-shared-position", JSON.stringify(newPos));
      } else {
        localStorage.setItem("robotipa-button-position", JSON.stringify(newPos));
      }
    }
  };

  const handleChatPositionChange = (newPos: Position) => {
    if (isMounted) {
      setChatPosition(newPos);
      if (sharedPositions) {
        setButtonPosition(newPos);
        localStorage.setItem("robotipa-shared-position", JSON.stringify(newPos));
      } else {
        localStorage.setItem("robotipa-chat-position", JSON.stringify(newPos));
      }
    }
  };

  return { buttonPosition, chatPosition, handleButtonPositionChange, handleChatPositionChange };
};

export default usePositions;
