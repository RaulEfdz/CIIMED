"use client";
import React, { useState, useCallback, useEffect } from "react";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";
import { X, MessageCircle, Minimize2, Maximize2 } from "lucide-react";
import { brandColors } from "@/tools/robotipa-bot/brand/brand";

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
  const [position, setPosition] = useState({
    x: initialPosition?.x ?? window.innerWidth - 400,
    y: initialPosition?.y ?? window.innerHeight - 500,
  });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  }, [position.x, position.y]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPosition({ x: newX, y: newY });
      onPositionChange?.({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset.x, dragOffset.y, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleMinimize = () => setIsMinimized(prev => !prev);

  return (
    <div className="z-50 transition-all duration-300"
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(10px)",
      }}>
      <div style={{
        backgroundColor: brandColors.surface,
        width: isMinimized ? "16rem" : "22rem",
        height: isMinimized ? "4rem" : "24rem",
      }} className="relative rounded-lg shadow-xl flex flex-col">
        <header
          onMouseDown={handleMouseDown}
          className="flex justify-between items-center p-3 rounded-t-lg"
          style={{
            backgroundColor: brandColors.primary,
            color: brandColors.onPrimary,
            cursor: "move",
          }}>
          <div className="flex items-center space-x-2">
            <MessageCircle size={18} />
            <h3 className="text-lg font-medium">Asistente Virtual</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              style={{ backgroundColor: brandColors.primary }}
              className="focus:outline-none p-1 rounded-full"
              aria-label={isMinimized ? "Maximizar chat" : "Minimizar chat"}>
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              style={{ backgroundColor: brandColors.primary }}
              className="focus:outline-none p-1 rounded-full"
              aria-label="Cerrar chat">
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