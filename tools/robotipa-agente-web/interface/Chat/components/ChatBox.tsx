"use client";
import React, { useState, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import { X, Minimize2, Maximize2 } from "lucide-react";
import { brandColors } from "@/tools/robotipa-agente-web/brand/brand";
import useDrag from "@/tools/robotipa-agente-web/hooks/useDrag";
import { WebAgentLink } from "./WebAgentLink";

interface ChatBoxProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  onClose,
  initialPosition,
  onPositionChange,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const startingPosition = {
    x: initialPosition?.x ?? window.innerWidth - 400,
    y: initialPosition?.y ?? window.innerHeight - 100,
  };

  // Extraemos la función handleMouseDown del hook useDrag
  const { position, handleMouseDown: originalHandleMouseDown } = useDrag(
    startingPosition,
    onPositionChange
  );

  // Nueva función que activa el estado de arrastre y llama a la función original
  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    originalHandleMouseDown(event);
  };

  // Al soltar el mouse se desactiva el estado de arrastre
  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleMinimize = () => setIsMinimized((prev) => !prev);

  return (
    <div
      className="z-50 transition-all"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(1px)",
      }}
    >
      <div
        style={{
          backgroundColor: brandColors.surface,
          width: isMinimized ? "16rem" : "22rem",
          height: isMinimized ? "4rem" : "24rem",
          // Ejemplo de cambio de estilo en el contenedor al arrastrar
          border: isDragging ? "2px dashed red" : "none",
        }}
        className="relative rounded-lg shadow-xl flex flex-col"
      >
        <header
          onMouseDown={handleMouseDown}
          className="flex justify-between items-center p-3 rounded-t-lg"
          style={{
            // Cambiamos el color de fondo del header mientras se arrastra
            backgroundColor: isDragging ? "#000" : brandColors.primary,
            color: brandColors.onPrimary,
            cursor: "move",
          }}
        >
         <WebAgentLink />

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              style={{ backgroundColor: brandColors.primary }}
              className="focus:outline-none p-1 rounded-full"
              aria-label={isMinimized ? "Maximizar chat" : "Minimizar chat"}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              style={{ backgroundColor: brandColors.primary }}
              className="focus:outline-none p-1 rounded-full"
              aria-label="Cerrar chat"
            >
              <X size={16} />
            </button>
          </div>
        </header>
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-hidden flex flex-col">
              <ChatHistory />
            </div>
            <ChatInput />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
