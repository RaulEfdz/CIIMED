"use client";
import React, {  useMemo } from "react";
import { BotIcon } from "lucide-react";
import { brandColors } from "../../../brand/brand";

interface FloatingIconProps {
  onClick: () => void;
  side?: "left" | "right";
  initialPosition?: { x: number; y: number };
}

const DEFAULT_MARGIN = 20;
const BUTTON_SIZE = 56; // Tamaño aproximado del botón

const FloatingIcon: React.FC<FloatingIconProps> = ({
  onClick,
  side = "right", // Por defecto el botón estará en el lado derecho
  initialPosition,
}) => {

  const position = useMemo(() => {
    if (typeof window !== "undefined") {
      return {
        x:
          initialPosition?.x ??
          (side === "right"
            ? window.innerWidth - BUTTON_SIZE - DEFAULT_MARGIN
            : DEFAULT_MARGIN),
        y:
          initialPosition?.y ??
          (window.innerHeight - BUTTON_SIZE - DEFAULT_MARGIN),
      };
    }
    return { x: 0, y: 0 };
  }, [initialPosition, side]);

  return (
    <div
      className="fixed z-50"
      style={{
        left:  side === "left" ? position.x : "auto",
        right: side === "right" ? position.x : "auto",
        top: position.y- 50,
      }}
    >
      <button
        onClick={onClick}
        className="p-2 rounded-full shadow-lg hover:shadow-2xl transition-shadow duration-300"
        style={{
          backgroundColor: brandColors.primary,
          cursor: "pointer",
        }}
        aria-label="Abrir chat"
      >
        <BotIcon className="h-8 w-8" style={{ color: brandColors.onPrimary }} />
      </button>
    </div>
  );
};

export default FloatingIcon;
