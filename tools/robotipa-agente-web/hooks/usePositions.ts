"use client";
import { useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

const DEFAULT_MARGIN = 20;
const BUTTON_HEIGHT = 56; // Tamaño aproximado del botón
const CHAT_BOX_DEFAULT_HEIGHT = 400; // Altura estimada para el chat

const usePositions = (sharedPositions: boolean, alignment: "TL" | "TR" | "BL" | "BR" | "CENTER") => {
  // Para este ejemplo, la posición inicial se define según la opción "BL" (bottom left)
  const [buttonPosition, setButtonPosition] = useState<Position>({
    x: DEFAULT_MARGIN,
    y: window.innerHeight - BUTTON_HEIGHT - DEFAULT_MARGIN,
  });
  const [chatPosition, setChatPosition] = useState<Position>({
    x: DEFAULT_MARGIN,
    y: window.innerHeight - CHAT_BOX_DEFAULT_HEIGHT - DEFAULT_MARGIN,
  });

  useEffect(() => {
    // Aquí podrías agregar lógica para actualizar las posiciones al cambiar el tamaño de la ventana
    const handleResize = () => {
      // Por ejemplo, recalcular las posiciones si es necesario
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePositionChange = (pos: Position) => {
    if (sharedPositions) {
      setButtonPosition(pos);
      setChatPosition(pos);
    } else {
      // Si no se comparten, se actualiza la posición del chat de forma independiente
      setChatPosition(pos);
    }
  };

  return { buttonPosition, chatPosition, handleChatPositionChange: handlePositionChange, isMounted: true };
};

export default usePositions;
