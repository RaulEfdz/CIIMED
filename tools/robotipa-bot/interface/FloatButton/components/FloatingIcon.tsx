"use client";
import React, { useState, useCallback, useEffect } from "react";
import { BotIcon } from "lucide-react";
import { brandColors } from "@/tools/robotipa-bot/brand/brand";

interface FloatingIconProps {
  onClick: () => void;
  side?: "left" | "right";
  initialPosition?: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({
  onClick,
  side = "right",
  initialPosition,
  onPositionChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: initialPosition?.x ?? (side === "right" ? window.innerWidth - 100 : 100),
    y: initialPosition?.y ?? window.innerHeight - 100,
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

  return (
    <div className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
      }}>
      <button
        onMouseDown={handleMouseDown}
        onClick={onClick}
        className="p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
        style={{
          backgroundColor: brandColors.primary,
          cursor: "move",
        }}
        aria-label="Abrir chat">
        <BotIcon className="h-8 w-8" style={{ color: brandColors.onPrimary }} />
      </button>
    </div>
  );
};

export default FloatingIcon;