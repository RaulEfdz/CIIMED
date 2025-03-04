"use client";
import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@/tools/robotipa-agente-web/hooks/useChat';
import { brandColors } from '@/tools/robotipa-agente-web/brand/brand';

interface Message {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  message: string;
  timestamp: number;
}

const ChatHistory: React.FC = () => {
  const { messages } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (bottomRef.current && !isScrolling) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isScrolling]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Prevent scroll event from propagating
    e.stopPropagation();
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const groupMessagesByDate = (msgs: Message[]) => {
    return msgs.reduce((groups, msg) => {
      const dateKey = new Date(msg.timestamp).toLocaleDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
      return groups;
    }, {} as { [key: string]: Message[] });
  };

  const messageGroups = groupMessagesByDate(messages);

  const renderMessageBubble = (msg: Message, index: number, msgs: Message[]) => {
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
      <div 
        key={msg.id} 
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
      >
        <div
          className={`
            max-w-xs md:max-w-md lg:max-w-lg 
            rounded-lg px-4 py-2 
            ${isUser ? 'rounded-br-none' : 'rounded-bl-none'}
            ${prevSenderIsSame ? (isUser ? 'mr-4' : 'ml-4') : ''}
          `}
          style={bubbleStyle}
        >
          <div className="break-words">{msg.message}</div>
          <div 
            className="text-xs mt-1" 
            style={{ color: brandColors.textSecondary }}
          >
            {formatTime(msg.timestamp)}
          </div>
        </div>
      </div>
    );
  };

  const renderDateGroupHeader = (date: string) => (
    <div className="flex justify-center my-2">
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
  );

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <p className="mb-2" style={{ color: brandColors.textSecondary }}>
        Pregunta lo que quieras sobre nosotros.
      </p>
      <p className="text-sm" style={{ color: brandColors.muted }}>
        Escribe un mensaje para comenzar la conversación.
      </p>
    </div>
  );

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto p-4 space-y-4 rounded-b-lg"
      style={{ 
        backgroundColor: brandColors.surface,
        height: '100%', 
        overflowY: 'auto',
        position: 'relative',
        willChange: 'scroll-position'
      }}
    >
      <div>
        {messages.length === 0 ? (
          renderEmptyState()
        ) : (
          Object.entries(messageGroups).map(([date, msgs]) => (
            <div key={date} className="space-y-3">
              {renderDateGroupHeader(date)}
              {msgs.map((msg, index, array) => renderMessageBubble(msg, index, array))}
            </div>
          ))
        )}
        <div 
          ref={bottomRef} 
          className="h-1 w-full" 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0 
          }} 
        />
      </div>
    </div>
  );
};

export default ChatHistory;