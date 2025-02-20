"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PANTONE_326 = "#285C4D";
const PANTONE_2026 = "#F4633A";
const PANTONE_419 = "#212322";

interface ChatMessage {
  id: number;
  sender: "user" | "bot";
  text: string;
}

const mockMessages: ChatMessage[] = [
  { id: 1, sender: "bot", text: "Hola, soy el asistente del CIIMED. ¿En qué puedo ayudarte hoy?" },
  { id: 2, sender: "user", text: "¿Qué es el CIIMED?" },
  { id: 3, sender: "bot", text: "El CIIMED es un centro de investigación médica dedicado a la innovación en salud y tecnología médica." },
];

export default function ChatBotUI() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      sender: "user",
      text: input,
    };

    setMessages([...messages, newMessage]);
    setInput("");

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: messages.length + 2,
        sender: "bot",
        text: "Esa es una gran pregunta. Nuestro equipo está aquí para ayudar.",
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
      <Card className="rounded-sm shadow-md bg-white ">
        <CardContent className="p-6 flex flex-col gap-4 h-[75vh]">
          <div className="overflow-y-auto space-y-3 p-2 border border-gray-300 rounded-sm h-[75vh]">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-md max-w-xs ${msg.sender === "user" ? "self-end ml-auto" : ""}`}
                style={{
                  backgroundColor: msg.sender === "user" ? PANTONE_2026 : "#f9f9f9",
                  color: msg.sender === "user" ? "#fff" : PANTONE_419,
                  border: msg.sender === "bot" ? `1px solid ${PANTONE_326}` : "none",
                }}
              >
                {msg.text}
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2  ">
            <input
              type="text"
              className="w-full p-2 border rounded-sm text-sm"
              placeholder="Escribe tu mensaje..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ borderColor: PANTONE_326 }}
            />
            <button
              className="p-2 rounded-sm bg-[#285C4D] text-white hover:bg-[#224B3E]"
              onClick={handleSend}
            >
              <Send size={18} />
            </button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
