"use client";
import React, { useState, useEffect, useRef } from "react";
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
  // useRef for timer and for the div with onWheel
  const isLoadedTimer = useRef<number | null>(null);
  const chatBoxDivRef = useRef<HTMLDivElement>(null); // Ref for the div with onWheel
  const chatHistoryRef = useRef<HTMLDivElement>(null); // Ref for ChatHistory scroll container

  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const startingPosition = {
    x: initialPosition?.x ?? window.innerWidth - 400,
    y: initialPosition?.y ?? window.innerHeight - 600,
  };

  const { position, handleMouseDown: originalHandleMouseDown } = useDrag(
    startingPosition,
    onPositionChange
  );

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    originalHandleMouseDown(event);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    // Consider using requestAnimationFrame for smoother transitions, but for a simple opacity, setTimeout is fine.
    isLoadedTimer.current = window.setTimeout(() => setIsLoaded(true), 10); // Increased to 10ms for better visibility, though very short durations are often ineffective. Consider removing or increasing further if transition is not noticeable.
    return () => {
      if (isLoadedTimer.current) {
        clearTimeout(isLoadedTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleMinimize = () => setIsMinimized((prev) => !prev);

  const preventBackgroundScroll = (e: React.WheelEvent) => {
    e.stopPropagation();

    if (chatBoxDivRef.current) {
      // Access scrollHeight and clientHeight from the div
      const scrollHeightValue = chatBoxDivRef.current.scrollHeight;
      const clientHeightValue = chatBoxDivRef.current.clientHeight;

      console.log("scrollHeight:", scrollHeightValue);
      console.log("clientHeight:", clientHeightValue);

      // You can now use scrollHeightValue and clientHeightValue for
      // your logic, for example, to check if there is overflow or
      // to implement custom scrolling behavior.
      if (scrollHeightValue > clientHeightValue) {
        console.log("The content is scrollable (scrollHeight > clientHeight)");
        // Perform actions when the content is scrollable within the ChatBox div
      } else {
        console.log(
          "The content is NOT scrollable (scrollHeight <= clientHeight)"
        );
        // Perform actions when the content is NOT scrollable within the ChatBox div
      }
    }
  };

  return (
    <div
      className="z-50 transition-opacity duration-200 overflow-hidden" // More semantic class name and duration
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? "translateY(0)" : "translateY(1px)", // Consider removing translateY if opacity transition is sufficient
      }}
      ref={chatBoxDivRef} // Attach the ref to the div
    >
      <div
        style={{
         scrollBehavior: "smooth",
          backgroundColor: brandColors.surface,
          width: isMinimized ? "16rem" : "22rem",
          height: isMinimized ? "4rem" : "auto",
          border: isDragging
            ? "2px dashed red"
            : `1px solid ${brandColors.border}`, // Template literals are cleaner for string concatenation with variables in styles.
          position: "relative",
          overflow: "hidden",
        }}
        className="relative rounded-lg shadow-xl flex flex-col"
      >
        <header
          onMouseDown={handleMouseDown}
          className="flex justify-between items-center p-3 rounded-t-lg"
          style={{
            backgroundColor: isDragging
              ? `${brandColors.primary}88`
              : brandColors.primary, // Template literals for clarity
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
              className="flex flex-col flex-1 overflow-hidden "
              onWheel={preventBackgroundScroll}

            >
              <ChatHistory ref={chatHistoryRef} />{" "}
              {/* Pass ref to ChatHistory */}
            </div>
            <ChatInput />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
