"use client";
import React, { useState, useEffect, useRef } from "react";
import { WebAgentLink } from "../components/WebAgentLink";

// Tipos para los mensajes del chat
interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  message: string;
  timestamp: number;
}
const DEBUG: boolean = process.env.NEXT_PUBLIC_DEBUG === "true";

// Servicio de chat (modificado para incluir modo mock)
const chatService = {
  // Función para enviar mensajes al API
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

      if (!response.ok) {
        throw new Error("Error en la comunicación con el servidor.");
      }

      // Detectamos si la respuesta es JSON o texto
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        const textResponse = await response.text();
        return {
          id: `msg-${Date.now()}`,
          sender: "bot",
          message:
            textResponse || "Respuesta del servidor en un formato inesperado.",
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      return {
        id: `error-${Date.now()}`,
        sender: "bot",
        message: "Lo siento, ocurrió un error al procesar tu mensaje.",
        timestamp: Date.now(),
      };
    }
  },

  // Respuestas predefinidas para el modo mock
  mockResponses: [
    "¡Hola! ¿En qué puedo ayudarte hoy?",
    "Claro, puedo ayudarte con eso.",
    "¿Necesitas más información sobre algún tema en particular?",
    "Estoy aquí para responder tus preguntas.",
    "¿Hay algo más en lo que pueda ayudarte?",
    "Esa es una buena pregunta. Déjame buscar la información para ti.",
    "Gracias por tu consulta. ¿Hay algo más que necesites saber?",
    "Entiendo tu preocupación. Vamos a resolver esto juntos.",
    "No dudes en contactarme si tienes más preguntas.",
    "Espero haber resuelto tu duda. ¿Puedo ayudarte con algo más?",
  ],

  // Función para generar respuestas mock
  sendChatMessageMock: async (userMessage: string): Promise<ChatMessage> => {
    // Espera simulada
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 1000 + 500)
    );

    let response: string;

    // Respuestas basadas en palabras clave
    if (userMessage.toLowerCase().includes("hola")) {
      response = "¡Hola! ¿Cómo puedo ayudarte hoy?";
    } else if (userMessage.toLowerCase().includes("gracias")) {
      response = "¡De nada! Estoy aquí para lo que necesites.";
    } else if (userMessage.toLowerCase().includes("ayuda")) {
      response =
        "Claro, estoy aquí para ayudarte. ¿En qué tema específico necesitas asistencia?";
    } else {
      // Respuesta aleatoria
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
  // Estados principales
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useMockMode, setUseMockMode] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para nuevos mensajes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Detector de teclado para dispositivos móviles
  useEffect(() => {
    // Detectar la aparición del teclado virtual
    const handleResize = () => {
      // En muchos dispositivos móviles, cuando aparece el teclado virtual,
      // la altura de la ventana se reduce
      const initialWindowHeight = window.innerHeight;
      
      // Detección de cambio de tamaño por aparición del teclado
      if (window.innerHeight < initialWindowHeight * 0.8) {
        setKeyboardVisible(true);
      } else {
        setKeyboardVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Manejadores para eventos de foco en input
    const handleFocus = () => {
      setKeyboardVisible(true);
      // Al enfocar, aseguramos que se hace scroll al fondo del chat
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    };
    
    const handleBlur = () => {
      setKeyboardVisible(false);
    };
    
    if (chatInputRef.current) {
      chatInputRef.current.addEventListener('focus', handleFocus);
      chatInputRef.current.addEventListener('blur', handleBlur);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chatInputRef.current) {
        chatInputRef.current.removeEventListener('focus', handleFocus);
        chatInputRef.current.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  // Alternar apertura/cierre del chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // Mensaje de bienvenida en primera apertura
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          message:
            "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
          timestamp: Date.now(),
        },
      ]);
    }
  };

  // Manejar el envío de mensajes
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() === "" || isLoading) return;

    // Añadir mensaje del usuario
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      message: inputText,
      timestamp: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      let response: ChatMessage;

      if (useMockMode) {
        // Usar mock service
        response = await chatService.sendChatMessageMock(userMessage.message);
      } else {
        // Usar API service
        response = await chatService.sendChatMessageAPI([
          ...messages,
          userMessage,
        ]);
      }

      setMessages((prevMessages) => [...prevMessages, response]);
    } catch {
      // Manejar error
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: "bot",
        message:
          "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        timestamp: Date.now(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Formatear la hora
  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Alternar entre modo mock y API
  const toggleMode = () => {
    setUseMockMode(!useMockMode);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Ventana del Chat - Ajustada para visibilidad con teclado virtual */}
      <div
        ref={chatContainerRef}
        className={`${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        } 
          transform transition-all duration-300 ease-in-out 
          max-h-96 w-72 md:w-80 bg-white 
          rounded-2xl shadow-xl mb-4 flex flex-col overflow-hidden
          ${keyboardVisible ? "bottom-20 fixed left-0 right-0 mx-auto top-4 max-h-none h-auto w-11/12 md:w-80" : ""}`}
        style={{
          ...(keyboardVisible && {
            position: 'fixed',
            height: 'auto',
            maxHeight: 'calc(100vh - 150px)',
          })
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <WebAgentLink />
          </div>

          <div className="flex items-center">
            {DEBUG && (
              <div className="mr-2 flex items-center">
                <span className="text-xs text-white mr-1">Mock</span>
                <button
                  onClick={toggleMode}
                  className="relative inline-flex items-center h-4 w-8 rounded-full transition-colors focus:outline-none"
                >
                  <span
                    className={`${
                      useMockMode ? "bg-gray-300" : "bg-green-400"
                    } absolute h-4 w-8 mx-auto rounded-full transition-colors`}
                  />
                  <span
                    className={`${
                      useMockMode ? "translate-x-0" : "translate-x-4"
                    } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                  />
                </button>
                <span className="text-xs text-white ml-1">API</span>
              </div>
            )}

            <button
              onClick={toggleChat}
              className="text-white focus:outline-none hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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

        {/* Contenedor de Mensajes - Optimizado para visibilidad con teclado */}
        <div className={`flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3 ${keyboardVisible ? "min-h-0" : "min-h-52"}`}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-ful ">
              <div className="text-gray-400 text-sm">
                Inicia una conversación
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3/4 ${
                    msg.sender === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 inline-block">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-2 rounded-lg rounded-tl-none border border-gray-200 shadow-sm">
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

        {/* Modo activo indicador */}
        {DEBUG && (
          <div className="bg-gray-100 border-t border-gray-200 px-3 py-1">
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  useMockMode ? "bg-yellow-400" : "bg-green-400"
                }`}
              ></div>
              <span className="text-xs text-gray-500">
                {useMockMode ? "Modo Mock (offline)" : "Modo API (online)"}
              </span>
            </div>
          </div>
        )}

        {/* Formulario de Entrada - Mantenido visible con el teclado */}
        <form
          onSubmit={handleSendMessage}
          className="p-2 bg-white border-t border-gray-100 flex items-center sticky bottom-0"
        >
          <input
            ref={chatInputRef}
            type="text"
            className="flex-1 border border-gray-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Escribe tu mensaje..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`ml-2 p-2 rounded-full focus:outline-none ${
              isLoading || inputText.trim() === ""
                ? "bg-gray-200 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 transition-colors"
            }`}
            disabled={isLoading || inputText.trim() === ""}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </form>
      </div>

      {/* Botón Flotante - Siempre visible, incluso con teclado */}
      <button
        onClick={toggleChat}
        className={`${
          isOpen ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
        } text-white p-3 rounded-full shadow-md focus:outline-none transition-colors flex justify-center items-center
        ${keyboardVisible ? "fixed bottom-4 right-4 z-50" : ""}`}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default RobotipaAW;