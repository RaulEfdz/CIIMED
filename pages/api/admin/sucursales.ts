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
    const sucursales = await prisma.sucursal.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(sucursales);
  }
  if (req.method === 'POST') {
    const { nombre, direccion, telefono, horario, mapaUrl, activo } = req.body;
    if (!nombre || !direccion) return res.status(400).json({ error: 'Nombre y dirección requeridos' });
    const sucursal = await prisma.sucursal.create({
      data: {
        nombre,
        direccion,
        telefono: telefono || null,
        horario: horario || null,
        mapaUrl: mapaUrl || null,
        activo: activo !== false,
      }
    });
    return res.status(201).json(sucursal);
  }
  if (req.method === 'PUT') {
    const { id, nombre, direccion, telefono, horario, mapaUrl, activo } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const sucursal = await prisma.sucursal.update({
      where: { id: Number(id) },
      data: { nombre, direccion, telefono: telefono || null, horario: horario || null, mapaUrl: mapaUrl || null, activo: activo !== false },
    });
    return res.status(200).json(sucursal);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.sucursal.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
