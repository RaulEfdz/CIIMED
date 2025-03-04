import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatMessage } from '../../types/chat';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      
      // Simular una respuesta del bot. Aquí se podría integrar una lógica más compleja o conectarse a una API externa.
      const botResponse: ChatMessage = {
        id: uuidv4(),
        sender: 'bot',
        message: `Has dicho: ${message}`,
        timestamp: Date.now(),
      };
      
      res.status(200).json(botResponse);
    } catch (error) {
      console.error('Error en el API:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido.`);
  }
}
