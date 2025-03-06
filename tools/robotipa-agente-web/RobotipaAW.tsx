"use client";
import React, { useState } from "react";
import FloatingIcon from "./interface/FloatButton/components/FloatingIcon";
import ChatBox from "./interface/Chat/components/ChatBox";
import usePositions from "./hooks/usePositions";
import { ChatProvider } from "./hooks/useChat";

interface RobotipaBotProps {
  sharedPositions?: boolean;
  alignment?: "TL" | "TR" | "BL" | "BR" | "CENTER";
  initialChatOpen?: boolean;
}

const RobotipaBot: React.FC<RobotipaBotProps> = ({
  sharedPositions = true,
  alignment = "BR",
  initialChatOpen = false,
}) => {
  const [isChatOpen, setIsChatOpen] = useState(initialChatOpen);

  const { buttonPosition, chatPosition, handleChatPositionChange, isMounted } =
    usePositions(sharedPositions, alignment);

  const handleToggleChat = () => setIsChatOpen(prev => !prev);

  if (!isMounted) return null;

  return (
    <ChatProvider>
      {isChatOpen ? (
        <ChatBox
          onClose={handleToggleChat}
          initialPosition={chatPosition}
          onPositionChange={handleChatPositionChange}
        />
      ) : (
        <FloatingIcon onClick={handleToggleChat} initialPosition={buttonPosition} side="right"/>
      )}
    </ChatProvider>
  );
};

export default RobotipaBot;
