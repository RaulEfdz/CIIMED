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
    const noticias = await prisma.noticia.findMany({ orderBy: { id: 'desc' } });
    return res.status(200).json(noticias);
  }
  if (req.method === 'POST') {
    const { titulo, contenido, imagen, publicado } = req.body;
    if (!titulo || !contenido) return res.status(400).json({ error: 'Título y contenido requeridos' });
    const noticia = await prisma.noticia.create({
      data: {
        titulo,
        contenido,
        imagen: imagen || null,
        publicado: publicado ? true : false,
      }
    });
    return res.status(201).json(noticia);
  }
  if (req.method === 'PUT') {
    const { id, titulo, contenido, imagen, publicado } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const noticia = await prisma.noticia.update({
      where: { id: Number(id) },
      data: { titulo, contenido, imagen: imagen || null, publicado: publicado ? true : false },
    });
    return res.status(200).json(noticia);
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    await prisma.noticia.delete({ where: { id: Number(id) } });
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
