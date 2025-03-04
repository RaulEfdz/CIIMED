"use client";
import React from "react";
import { BotIcon } from "lucide-react";
import { brandColors } from "@/tools/robotipa-agente-web/brand/brand";
import useDrag from "@/tools/robotipa-agente-web/hooks/useDrag";

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
  const startingPosition = {
    x: initialPosition?.x ?? (side === "right" ? window.innerWidth - 100 : 100),
    y: initialPosition?.y ?? window.innerHeight - 100,
  };

  const { position, handleMouseDown } = useDrag(startingPosition, onPositionChange);

  return (
    <div
      className="fixed z-50"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        onMouseDown={handleMouseDown}
        onClick={onClick}
        className="p-2 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300 "
        style={{
          backgroundColor: brandColors.primary,
          cursor: "move",
        }}
        aria-label="Abrir chat"
      >
        <BotIcon className="h-8 w-8 cursor-pointer " style={{ color: brandColors.onPrimary }} />
      </button>
    </div>
  );
};

export default FloatingIcon;
