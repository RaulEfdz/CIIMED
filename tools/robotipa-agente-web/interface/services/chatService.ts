import { ChatMessage } from "../../types/chat";

export async function sendChatMessage(message: string): Promise<ChatMessage> {
  try {
    const response = await fetch('/api/chat/router', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error('Error en la comunicación con el servidor.');
    }
    
    const data = await response.json();
    return data as ChatMessage;
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    throw error;
  }
}
