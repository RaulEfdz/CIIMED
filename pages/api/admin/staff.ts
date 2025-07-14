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
    const equipoDeTrabajo = await prisma.equipoDeTrabajo.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(equipoDeTrabajo);
  }
  if (req.method === 'POST') {
    const { nombre, puesto, bio, foto, activo } = req.body;
    if (!nombre || !puesto) return res.status(400).json({ error: 'Nombre y puesto requeridos' });
    const equipoDeTrabajo = await prisma.equipoDeTrabajo.create({
      data: {
        nombre,
        puesto,
        bio: bio || null,
        foto: foto || null,
        activo: activo !== false,
      }
    });
    return res.status(201).json(equipoDeTrabajo);
  }
  if (req.method === 'PUT') {
    const { id, nombre, puesto, bio, foto, activo } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const equipoDeTrabajo = await prisma.equipoDeTrabajo.update({
      where: { id: Number(id) },
      data: { nombre, puesto, bio: bio || null, foto: foto || null, activo: activo !== false },
    });
    return res.status(200).json(equipoDeTrabajo);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.equipoDeTrabajo.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
