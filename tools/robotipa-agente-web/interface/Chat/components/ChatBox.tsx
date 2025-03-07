"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import { X, Minimize2, Maximize2 } from "lucide-react";

import { WebAgentLink } from "./WebAgentLink";
import useDrag from "../../../hooks/useDrag";
import { brandColors } from "../../../brand/brand";

interface ChatBoxProps {
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  onPositionChange?: (pos: { x: number; y: number }) => void;
}

const DEFAULT_MARGIN = 20;
const CHAT_BOX_DEFAULT_HEIGHT = 400; // Altura estimada para posicionar el chat

const ChatBox: React.FC<ChatBoxProps> = ({ onClose, initialPosition, onPositionChange }) => {
  const isLoadedTimer = useRef<number | null>(null);
  const chatBoxDivRef = useRef<HTMLDivElement>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Posición inicial: por defecto en la parte inferior izquierda
  const startingPosition = useMemo(() => ({
    x: initialPosition?.x ?? DEFAULT_MARGIN,
    y: initialPosition?.y ?? (window.innerHeight - CHAT_BOX_DEFAULT_HEIGHT - DEFAULT_MARGIN),
  }), [initialPosition]);

  const { position, handleMouseDown: originalHandleMouseDown } = useDrag(startingPosition, onPositionChange);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    originalHandleMouseDown(event);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    isLoadedTimer.current = window.setTimeout(() => setIsLoaded(true), 10);
    return () => {
      if (isLoadedTimer.current) clearTimeout(isLoadedTimer.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleMinimize = () => setIsMinimized(prev => !prev);

  const preventBackgroundScroll = (e: React.WheelEvent) => {
    e.stopPropagation();
    if (chatBoxDivRef.current) {
      // const { scrollHeight, clientHeight } = chatBoxDivRef.current;
      // // Aquí se puede agregar lógica adicional si se requiere comportamiento personalizado en el scroll
    }
  };

  return (
    <div
      className="z-50 transition-opacity duration-200 overflow-hidden shadow-2xl"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(1px)",
      }}
      ref={chatBoxDivRef}
    >
      <div
        style={{
          scrollBehavior: "smooth",
          backgroundColor: brandColors.surface,
          width: isMinimized ? "16rem" : "22rem",
          height: isMinimized ? "4rem" : "auto",
          border: isDragging ? "2px dashed red" : `1px solid ${brandColors.border}`,
          position: "relative",
          overflow: "hidden",
        }}
        className="relative rounded-lg shadow-xl flex flex-col"
      >
        <header
          onMouseDown={handleMouseDown}
          className="flex justify-between items-center p-3 rounded-t-lg"
          style={{
            backgroundColor: isDragging ? `${brandColors.primary}88` : brandColors.primary,
            color: brandColors.onPrimary,
            cursor: "move",
          }}
        >
          <WebAgentLink />
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              style={{ backgroundColor: "transparent" }}
              className="focus:outline-none p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label={isMinimized ? "Maximizar chat" : "Minimizar chat"}
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              style={{ backgroundColor: "transparent" }}
              className="focus:outline-none p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Cerrar chat"
            >
              <X size={16} />
            </button>
          </div>
        </header>
        {!isMinimized && (
          <>
            <div
              className="flex flex-col flex-1 overflow-hidden"
              onWheel={preventBackgroundScroll}
            >
              <ChatHistory ref={chatHistoryRef} />
            </div>
            <ChatInput />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
