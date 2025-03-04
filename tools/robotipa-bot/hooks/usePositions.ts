"use client";
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

const usePositions = (sharedPositions: boolean): UsePositionsReturn => {
  const [buttonPosition, setButtonPosition] = useState<Position>({ x: 0, y: 0 });
  const [chatPosition, setChatPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (sharedPositions) {
      // Cargar posición compartida
      const savedShared = localStorage.getItem("robotipa-shared-position");
      if (savedShared) {
        const pos = JSON.parse(savedShared);
        setButtonPosition(pos);
        setChatPosition(pos);
      } else {
        const defaultPos = { x: window.innerWidth - 100, y: window.innerHeight - 100 };
        setButtonPosition(defaultPos);
        setChatPosition(defaultPos);
      }
    } else {
      // Cargar posiciones separadas
      const savedButtonPos = localStorage.getItem("robotipa-button-position");
      const savedChatPos = localStorage.getItem("robotipa-chat-position");
      setButtonPosition(
        savedButtonPos
          ? JSON.parse(savedButtonPos)
          : { x: window.innerWidth - 100, y: window.innerHeight - 100 }
      );
      setChatPosition(
        savedChatPos
          ? JSON.parse(savedChatPos)
          : { x: window.innerWidth - 400, y: window.innerHeight - 500 }
      );
    }
  }, [sharedPositions]);

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
