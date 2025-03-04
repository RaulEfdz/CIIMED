"use client";
import React, { useState } from "react";
import FloatingIcon from "./interface/FloatButton/components/FloatingIcon";
import ChatBox from "./interface/Chat/components/ChatBox";
import usePositions from "./hooks/usePositions";
import { ChatProvider } from "./hooks/useChat";

interface RobotipaBotProps {
  sharedPositions?: boolean;
}

const RobotipaBot: React.FC<RobotipaBotProps> = ({ sharedPositions = false }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const {
    buttonPosition,
    chatPosition,
    handleButtonPositionChange,
    handleChatPositionChange,
  } = usePositions(sharedPositions);

  const handleToggleChat = () => setIsChatOpen((prev) => !prev);

  return (
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
  );
};

export default RobotipaBot;
