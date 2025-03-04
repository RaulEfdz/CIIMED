"use client";
import React, { useState, FormEvent } from 'react';
import { useChat } from '@/tools/robotipa-agente-web/hooks/useChat';
import { brandColors } from '@/tools/robotipa-agente-web/brand/brand';

const ChatInput: React.FC = () => {
  const { sendMessage } = useChat();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsSending(true);
    try {
      await sendMessage(input.trim());
      setInput('');
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-4 border-t" style={{ borderColor: brandColors.border }}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu mensaje..."
        style={{ borderColor: brandColors.border }}
        className="flex-1 border rounded-l px-4 py-2 focus:outline-none"
        disabled={isSending}
      />
      <button
        type="submit"
        disabled={isSending || !input.trim()}
        style={{ backgroundColor: brandColors.primary }}
        className="text-white px-4 py-2 rounded-r focus:outline-none transition-colors disabled:opacity-50"
      >
        {isSending ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default ChatInput;
