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
    const staff = await prisma.staff.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(staff);
  }
  if (req.method === 'POST') {
    const { nombre, puesto, bio, foto, activo } = req.body;
    if (!nombre || !puesto) return res.status(400).json({ error: 'Nombre y puesto requeridos' });
    const staff = await prisma.staff.create({
      data: {
        nombre,
        puesto,
        bio: bio || null,
        foto: foto || null,
        activo: activo !== false,
      }
    });
    return res.status(201).json(staff);
  }
  if (req.method === 'PUT') {
    const { id, nombre, puesto, bio, foto, activo } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const staff = await prisma.staff.update({
      where: { id: Number(id) },
      data: { nombre, puesto, bio: bio || null, foto: foto || null, activo: activo !== false },
    });
    return res.status(200).json(staff);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.staff.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
