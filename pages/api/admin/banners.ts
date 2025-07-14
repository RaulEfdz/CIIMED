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
    const banners = await prisma.banner.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(banners);
  }
  if (req.method === 'POST') {
    const { titulo, imagen, link, activo } = req.body;
    if (!imagen) return res.status(400).json({ error: 'Imagen requerida' });
    const banner = await prisma.banner.create({
      data: {
        titulo: titulo || null,
        imagen,
        link: link || null,
        activo: activo !== false,
      }
    });
    return res.status(201).json(banner);
  }
  if (req.method === 'PUT') {
    const { id, titulo, imagen, link, activo } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const banner = await prisma.banner.update({
      where: { id: Number(id) },
      data: { titulo: titulo || null, imagen, link: link || null, activo: activo !== false },
    });
    return res.status(200).json(banner);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.banner.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
