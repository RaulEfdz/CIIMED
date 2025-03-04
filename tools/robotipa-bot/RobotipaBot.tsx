"use client";
import React, { useState, useEffect } from "react";
import FloatingIcon from "./interface/FloatButton/components/FloatingIcon";
import ChatBox from "./interface/Chat/components/ChatBox";
import { ChatProvider } from "./hooks/useChat";

const RobotipaBot: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Cargamos las posiciones guardadas en localStorage después del montaje
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [chatPosition, setChatPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    // Cargar posiciones solo en el cliente
    const savedButtonPos = localStorage.getItem("robotipa-button-position");
    const savedChatPos = localStorage.getItem("robotipa-chat-position");
    
    setButtonPosition(savedButtonPos 
      ? JSON.parse(savedButtonPos)
      : { x: window.innerWidth - 100, y: window.innerHeight - 100 });
    
    setChatPosition(savedChatPos
      ? JSON.parse(savedChatPos)
      : { x: window.innerWidth - 400, y: window.innerHeight - 500 });
  }, []);

  const handleToggleChat = () => setIsChatOpen(prev => !prev);

  const handleButtonPositionChange = (newPos: { x: number; y: number }) => {
    if(isMounted) {
      setButtonPosition(newPos);
      localStorage.setItem("robotipa-button-position", JSON.stringify(newPos));
    }
  };

  const handleChatPositionChange = (newPos: { x: number; y: number }) => {
    if(isMounted) {
      setChatPosition(newPos);
      localStorage.setItem("robotipa-chat-position", JSON.stringify(newPos));
    }
  };

  if(!isMounted) return null;

  return (
    <>
      <ChatProvider>
        {isChatOpen ? (
          <ChatBox
            onClose={handleToggleChat}
            initialPosition={chatPosition}
            onPositionChange={handleChatPositionChange}
          />
        ) : (
          <FloatingIcon
            onClick={handleToggleChat}
            initialPosition={buttonPosition}
            onPositionChange={handleButtonPositionChange}
          />
        )}
      </ChatProvider>
    </>
  );
};

export default RobotipaBot;