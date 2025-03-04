"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendChatMessage } from "../interface/services/chatService";
import { ChatMessage } from "../types/chat";

interface ChatContextProps {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  sendMessage: (messageText: string) => Promise<void>;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (messageText: string) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: "user",
      message: messageText,
      timestamp: Date.now(),
    };
    addMessage(userMessage);
  
    try {
      const botResponse = await sendChatMessage([...messages, userMessage]);
      addMessage(botResponse);
    } catch {
      addMessage({
        id: uuidv4(),
        sender: "bot",
        message: "Lo siento, ocurrió un error al procesar tu mensaje.",
        timestamp: Date.now(),
      });
    }
  };
  

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, sendMessage, isChatOpen, setIsChatOpen }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextProps => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
//MODIFICADO aqui