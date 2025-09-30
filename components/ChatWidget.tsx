'use client'

import { useState, useRef, useEffect } from 'react'
import { X, MessageCircle, Send } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente virtual del CIIMED. ¿En qué puedo ayudarte hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    setInput('')
    setIsLoading(true)

    // Agregar mensaje del usuario
    const userMessage: Message = { role: 'user', content: trimmedInput }
    setMessages(prev => [...prev, userMessage, { role: 'assistant', content: '' }])

    // Cancelar request anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Nuevo AbortController
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: trimmedInput }),
        signal: abortController.signal
      })

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (reader) {
        const { value, done } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        assistantMessage += chunk

        // Actualizar el último mensaje (asistente)
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: assistantMessage
          }
          return newMessages
        })
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error sending message:', error)
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: '⚠️ Error al procesar tu mensaje. Por favor intenta nuevamente.'
          }
          return newMessages
        })
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Solo mostrar si el chat está habilitado
  if (process.env.NEXT_PUBLIC_CHAT_ENABLED !== 'true') {
    return null
  }

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50"
          aria-label="Abrir chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Widget de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Asistente CIIMED</h3>
              <p className="text-emerald-100 text-sm">¿En qué te puedo ayudar?</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-100 hover:text-white transition-colors"
              aria-label="Cerrar chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu pregunta..."
                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white p-2 rounded-xl transition-colors"
                aria-label="Enviar mensaje"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}