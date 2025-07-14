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
    const documentos = await prisma.documento.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(documentos);
  }
  if (req.method === 'POST') {
    const { nombre, url, activo } = req.body;
    if (!nombre || !url) return res.status(400).json({ error: 'Nombre y URL requeridos' });
    const documento = await prisma.documento.create({
      data: {
        nombre,
        url,
        activo: activo !== false,
      }
    });
    return res.status(201).json(documento);
  }
  if (req.method === 'PUT') {
    const { id, nombre, url, activo } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const documento = await prisma.documento.update({
      where: { id: Number(id) },
      data: { nombre, url, activo: activo !== false },
    });
    return res.status(200).json(documento);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.documento.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
