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
    const promociones = await prisma.promocion.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(promociones);
  }
  if (req.method === 'POST') {
    const { titulo, descripcion, imagen, vigente } = req.body;
    if (!titulo) return res.status(400).json({ error: 'Título requerido' });
    const promocion = await prisma.promocion.create({
      data: {
        titulo,
        descripcion: descripcion || null,
        imagen: imagen || null,
        vigente: vigente !== false,
      }
    });
    return res.status(201).json(promocion);
  }
  if (req.method === 'PUT') {
    const { id, titulo, descripcion, imagen, vigente } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const promocion = await prisma.promocion.update({
      where: { id: Number(id) },
      data: { titulo, descripcion: descripcion || null, imagen: imagen || null, vigente: vigente !== false },
    });
    return res.status(200).json(promocion);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.promocion.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
