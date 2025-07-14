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
    const testimonios = await prisma.testimonio.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(testimonios);
  }
  if (req.method === 'POST') {
    const { nombre, mensaje, foto, activo } = req.body;
    if (!nombre || !mensaje) return res.status(400).json({ error: 'Nombre y mensaje requeridos' });
    const testimonio = await prisma.testimonio.create({
      data: {
        nombre,
        mensaje,
        foto: foto || null,
        activo: activo !== false,
      }
    });
    return res.status(201).json(testimonio);
  }
  if (req.method === 'PUT') {
    const { id, nombre, mensaje, foto, activo } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const testimonio = await prisma.testimonio.update({
      where: { id: Number(id) },
      data: { nombre, mensaje, foto: foto || null, activo: activo !== false },
    });
    return res.status(200).json(testimonio);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.testimonio.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
