"use client";
import React, { useRef, useEffect } from 'react';
import { useChat } from '@/tools/robotipa-agente-web/hooks/useChat';
import { brandColors } from '@/tools/robotipa-agente-web/brand/brand';

const ChatHistory: React.FC = () => {
  const { messages } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hace scroll al último mensaje cuando se agregan nuevos
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Función para formatear la hora
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Agrupar mensajes por día
  const groupMessagesByDate = () => {
    const groups: { [key: string]: typeof messages } = {};
    messages.forEach(msg => {
      const date = new Date(msg.timestamp);
      const dateKey = date.toLocaleDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4 rounded-b-lg"
      style={{ backgroundColor: brandColors.surface }}
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <p className="mb-2" style={{ color: brandColors.textSecondary }}>
            No hay mensajes todavía.
          </p>
          <p className="text-sm" style={{ color: brandColors.muted }}>
            Escribe un mensaje para comenzar la conversación.
          </p>
        </div>
      ) : (
        Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date} className="space-y-3">
            <div className="flex justify-center">
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: brandColors.backgroundAlt,
                  color: brandColors.textSecondary,
                }}
              >
                {date}
              </span>
            </div>
            {msgs.map((msg, index) => {
              const isUser = msg.sender === 'user';
              const prevSenderIsSame = index > 0 && msgs[index - 1].sender === msg.sender;
              const bubbleStyle = isUser
                ? {
                    backgroundColor: brandColors.primary,
                    color: brandColors.onPrimary,
                  }
                : {
                    backgroundColor: brandColors.surface,
                    border: `1px solid ${brandColors.border}`,
                    color: brandColors.textPrimary,
                  };
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                      isUser ? 'rounded-br-none' : 'rounded-bl-none'
                    } ${prevSenderIsSame ? (isUser ? 'mr-4' : 'ml-4') : ''}`}
                    style={bubbleStyle}
                  >
                    <div className="break-words">{msg.message}</div>
                    <div className="text-xs mt-1" style={{ color: brandColors.textSecondary }}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatHistory;
