import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const faqs = await prisma.fAQ.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(faqs);
  }
  if (req.method === 'POST') {
    const { pregunta, respuesta, activo } = req.body;
    if (!pregunta || !respuesta) return res.status(400).json({ error: 'Pregunta y respuesta requeridas' });
    const faq = await prisma.fAQ.create({
      data: {
        pregunta,
        respuesta,
        activo: activo !== false,
      }
    });
    return res.status(201).json(faq);
  }
  if (req.method === 'PUT') {
    const { id, pregunta, respuesta, activo } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const faq = await prisma.fAQ.update({
      where: { id: Number(id) },
      data: { pregunta, respuesta, activo: activo !== false },
    });
    return res.status(200).json(faq);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.fAQ.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
