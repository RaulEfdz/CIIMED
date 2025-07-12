import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Permitir JSON en DELETE
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Listar servicios
    const servicios = await prisma.servicio.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(servicios);
  }
  if (req.method === 'POST') {
    const { nombre, descripcion, precio } = req.body;
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });
    const servicio = await prisma.servicio.create({
      data: {
        nombre,
        descripcion,
        precio: precio ? Number(precio) : null,
      }
    });
    return res.status(201).json(servicio);
  }
  if (req.method === 'PUT') {
    const { id, nombre, descripcion, precio } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const servicio = await prisma.servicio.update({
      where: { id: Number(id) },
      data: { nombre, descripcion, precio: precio ? Number(precio) : null },
    });
    return res.status(200).json(servicio);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.servicio.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
