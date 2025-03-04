import { ChatMessage } from "../../types/chat";

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatMessage> {
  try {
    const formattedMessages = messages.map(msg => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.message
    }));

    const response = await fetch('/api/tools/robotipa-agente-web', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: formattedMessages })
    });

    if (!response.ok) {
      throw new Error('Error en la comunicación con el servidor.');
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
        message: textResponse || "Respuesta del servidor en un formato inesperado.",
        timestamp: Date.now(),
      };
    }
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    return {
      id: `error-${Date.now()}`,
      sender: "bot",
      message: "Lo siento, ocurrió un error al procesar tu mensaje.",
      timestamp: Date.now(),
    };
  }
}


//MODIFICADO aqui