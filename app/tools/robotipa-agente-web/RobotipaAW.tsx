"use client";
import React, { useState, useEffect, useRef } from "react";
import { WebAgentLink } from "./components/WebAgentLink";
import { useRouter } from "next/navigation";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  message: string;
  timestamp: number;
}

const DEBUG: boolean = process.env.NEXT_PUBLIC_DEBUG === "false";



const chatService = {
  sendChatMessageAPI: async (messages: ChatMessage[]): Promise<ChatMessage> => {
    try {
      const formattedMessages = messages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.message,
      }));

      const response = await fetch("/api/tools/robotipa-agente-web", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: formattedMessages }),
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      } else {
        const textResponse = await response.text();
        return {
          id: `msg-${Date.now()}`,
          sender: "bot",
          message: textResponse || "Respuesta inesperada",
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error("Error:", error);
      return {
        id: `error-${Date.now()}`,
        sender: "bot",
        message: "Error al procesar tu mensaje",
        timestamp: Date.now(),
      };
    }
  },

  mockResponses: [
    "¡Hola! ¿En qué puedo ayudarte?",
    "Claro, puedo ayudarte con eso",
    "¿Necesitas más información?",
  ],

  sendChatMessageMock: async (userMessage: string): Promise<ChatMessage> => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 500)
    );

    let response: string;
    if (userMessage.toLowerCase().includes("hola")) {
      response = "¡Hola! ¿Cómo puedo ayudarte?";
    } else if (userMessage.toLowerCase().includes("gracias")) {
      response = "¡De nada!";
    } else {
      response =
        chatService.mockResponses[
          Math.floor(Math.random() * chatService.mockResponses.length)
        ];
    }

    return {
      id: `bot-${Date.now()}`,
      sender: "bot",
      message: response,
      timestamp: Date.now(),
    };
  },
};

const RobotipaAW = () => {
  const Routert = useRouter()
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useMockMode, setUseMockMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileUA = /iphone|ipad|ipod|android/.test(userAgent);
      const isMobileViewport = window.innerWidth <= 768;
      setIsMobile(isMobileUA || isMobileViewport);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          message: "¡Hola! Soy tu asistente virtual",
          timestamp: Date.now(),
        },
      ]);
    }
  };

  // const handleSendMessage = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!inputText.trim() || isLoading) return;

  //   const userMessage: ChatMessage = {
  //     id: `user-${Date.now()}`,
  //     sender: "user",
  //     message: inputText,
  //     timestamp: Date.now(),
  //   };

  //   setMessages((prev) => [...prev, userMessage]);
  //   setInputText("");
  //   setIsLoading(true);

  //   try {
  //     const response = useMockMode
  //       ? await chatService.sendChatMessageMock(userMessage.message)
  //       : await chatService.sendChatMessageAPI([...messages, userMessage]);

  //     setMessages((prev) => [...prev, response]);
  //   } catch {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         id: `error-${Date.now()}`,
  //         sender: "bot",
  //         message: "Error al procesar",
  //         timestamp: Date.now(),
  //       },
  //     ]);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  

  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      message: inputText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = useMockMode
        ? await chatService.sendChatMessageMock(userMessage.message)
        : await chatService.sendChatMessageAPI([...messages, userMessage]);
        const modifiedResponse = {
          ...response,
          // message: response.message.replace(/https?:\/\/192\.168\.0\.197:\d+/, "Te llevare!"),
          message: response.message.includes("http://192.168.0.197:3000") ? "Te llevare!" : response.message
        };
        // Ahora puedes usar 'modifiedResponse' con la propiedad 'message' modificada.
      setMessages((prev) => [...prev, modifiedResponse]);

      // Expresión regular para detectar URLs
      const urlRegex = new RegExp(`${"http://192.168.0.197:3000"}/[\\w-/]+`, "g");
      const foundUrls = response.message.match(urlRegex);

      // Si hay una URL en el mensaje, redirige automáticamente
      if (foundUrls && foundUrls.length > 0) {
        // Routert.push(foundUrls[0].replace("192.168.0.197:3000"))
        Routert.push(foundUrls[0].replace(/https?:\/\/192\.168\.0\.197:\d+/, window.location.origin));        // window.location.href = foundUrls[0]; // Redirigir a la primera URL encontrada
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "bot",
          message: "Error al procesar",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
};


  return (
    <div className={`fixed bottom-6 right-6 z-50 font-sans`}>
      <div
        className={`${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        } transform transition-all duration-300 ${
          isMobile ? "left-0 max-h-[45vh] h-full min-h-[30vh] w-full fixed top-0" : "max-h-[70vh] w-80"
        } bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden`}
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-4 flex justify-between items-center">
          <WebAgentLink />
          <div className="flex items-center gap-2">
            {DEBUG && (
              <button
                onClick={() => setUseMockMode(!useMockMode)}
                className={`px-2 py-1 rounded-full text-xs ${
                  useMockMode ? "bg-yellow-400" : "bg-green-400"
                } text-white`}
              >
                {useMockMode ? "Mock" : "API"}
              </button>
            )}
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/10 p-1 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className={`flex-1 p-4 overflow-y-auto bg-gray-50 ${
          isMobile ? "h-[calc(100vh-180px)]" : "max-h-[50vh]"
        }`}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs text-gray-500/80 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSendMessage}
          className="bg-white border-t border-gray-100 p-4"
        >
          <div className="flex gap-2">
            <input
              ref={chatInputRef}
              type="text"
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Escribe tu mensaje..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              autoFocus={isOpen}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {!isOpen && (
  <button
    onClick={toggleChat}
    className={`fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-xl hover:bg-blue-600 transition-all ${
      isOpen ? "rotate-0" : ""
    }`}
    style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)" }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  </button>
)}


    </div>
  );
};

export default RobotipaAW;