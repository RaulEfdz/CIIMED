
"use client";
import React, { useState, useEffect, useRef } from "react";
import { WebAgentLink } from "./components/WebAgentLink";

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  message: string;
  timestamp: number;
}

const DEBUG: boolean = process.env.NEXT_PUBLIC_DEBUG === "true";

const MOBILE_CONFIG = {
  keyboardOpenTop: 0,
  keyboardOpenMaxHeight: "90vh",
  normalBottom: 6,
  normalRight: 6,
  buttonBottom: 4,
  buttonRight: 4,
};

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
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500));
    
    let response: string;
    if (userMessage.toLowerCase().includes("hola")) {
      response = "¡Hola! ¿Cómo puedo ayudarte?";
    } else if (userMessage.toLowerCase().includes("gracias")) {
      response = "¡De nada!";
    } else {
      response = chatService.mockResponses[
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

const VirtualKeyboard = ({ onKeyPress }: { onKeyPress: (key: string) => void }) => {
  const [isShift, setIsShift] = useState(false);
  const [isSymbols, setIsSymbols] = useState(false);

  const handleKey = (key: string) => {
    if (key === '⇧') {
      setIsShift(!isShift);
      return;
    }
    if (key === '?123') {
      setIsSymbols(!isSymbols);
      return;
    }
    if (key === '⌫') {
      onKeyPress('BACKSPACE');
      return;
    }
    onKeyPress(isShift ? key.toUpperCase() : key.toLowerCase());
    if (isShift) setIsShift(false);
  };

  const rows = isSymbols ? [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
    ['?123', '.', ',', '?', '!', "'", '💶', '⌫']
  ] : [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
    ['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
    ['?123', '🌐', '✅', '⌫']
  ];

  return (
    <div className="bg-gray-100 p-2 safe-area-bottom">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center mb-2 gap-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className={`min-w-[2.5rem] h-12 px-2 rounded-lg flex items-center justify-center
                ${key === '⇧' && isShift ? 'bg-blue-200' : 'bg-white'}
                ${key === '✅' ? 'bg-green-500 text-white' : ''}
                ${key.length > 1 ? 'text-sm' : ''}`}
            >
              {key === '⌫' ? '⌫' : 
               key === '⇧' ? '⇧' : 
               key === '✅' ? 'Enviar' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

const RobotipaAW = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useMockMode, setUseMockMode] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, keyboardVisible]);

  useEffect(() => {
    const handleFocus = () => setKeyboardVisible(true);
    const handleBlur = () => setKeyboardVisible(false);
    
    const input = chatInputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    }
    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && window.visualViewport) {
      const handleResize = () => {
        const viewportHeight = window.visualViewport?.height || 0;
        setKeyboardVisible(window.innerHeight - viewportHeight > 100);
      };
      window.visualViewport?.addEventListener('resize', handleResize);
      return () => window.visualViewport?.removeEventListener('resize', handleResize);
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0) {
      setMessages([{
        id: "welcome",
        sender: "bot",
        message: "¡Hola! Soy tu asistente virtual",
        timestamp: Date.now(),
      }]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      message: inputText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = useMockMode 
        ? await chatService.sendChatMessageMock(userMessage.message)
        : await chatService.sendChatMessageAPI([...messages, userMessage]);
      
      setMessages(prev => [...prev, response]);
    } catch {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        sender: "bot",
        message: "Error al procesar",
        timestamp: Date.now(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatContainerStyles = keyboardVisible ? {
    position: 'fixed',
    top: '10vh',
    bottom: '0',
    width: '100%',
    maxHeight: '90vh',
    borderRadius: '0',
    zIndex: 9999
  } : {};

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <div
        ref={chatContainerRef}
        className={`${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        } transform transition-all duration-300 max-h-96 w-72 md:w-80 bg-white rounded-2xl shadow-xl mb-4 flex flex-col overflow-hidden`}
        style={chatContainerStyles as React.CSSProperties}
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 flex justify-between items-center">
          <WebAgentLink />
          <div className="flex items-center">
            {DEBUG && (
              <div className="mr-2 flex items-center">
                <span className="text-xs text-white mr-1">Mock</span>
                <button
                  onClick={() => setUseMockMode(!useMockMode)}
                  className="relative inline-flex items-center h-4 w-8 rounded-full"
                >
                  <span className={`${useMockMode ? "bg-gray-300" : "bg-green-400"} absolute h-4 w-8 rounded-full`} />
                  <span className={`${useMockMode ? "translate-x-0" : "translate-x-4"} inline-block h-4 w-4 bg-white rounded-full transform`} />
                </button>
                <span className="text-xs text-white ml-1">API</span>
              </div>
            )}
            <button onClick={toggleChat} className="text-white p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-3/4 p-2 rounded-lg ${
                msg.sender === "user" 
                  ? "bg-blue-500 text-white rounded-tr-none" 
                  : "bg-white border border-gray-200 rounded-tl-none shadow-sm"}`}>
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs text-gray-500">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-2 rounded-tl-none border border-gray-200 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="bg-white border-t border-gray-100 sticky bottom-0">
          <div className="p-2 relative">
            <input
              ref={chatInputRef}
              type="text"
              className="absolute opacity-0 -z-10"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="min-h-[2.5rem] p-2 border border-gray-200 rounded-lg mb-2">
              {inputText || <span className="text-gray-400">Escribe tu mensaje...</span>}
            </div>
            {keyboardVisible && (
              <VirtualKeyboard
                onKeyPress={(key) => {
                  if (key === 'BACKSPACE') {
                    setInputText(prev => prev.slice(0, -1));
                  } else if (key === '✅') {
                    handleSendMessage(new Event('submit') as unknown as React.FormEvent);
                  } else {
                    setInputText(prev => prev + key);
                  }
                }}
              />
            )}
          </div>
        </form>
      </div>

      <button
        onClick={toggleChat}
        className={`${isOpen ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"} text-white p-3 rounded-full shadow-md ${
          keyboardVisible ? "fixed bottom-4 right-4 z-50" : ""
        }`}
        style={keyboardVisible ? {
          position: 'fixed',
          bottom: `${MOBILE_CONFIG.buttonBottom}rem`,
          right: `${MOBILE_CONFIG.buttonRight}rem`,
          zIndex: 9999
        } : {}}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default RobotipaAW;