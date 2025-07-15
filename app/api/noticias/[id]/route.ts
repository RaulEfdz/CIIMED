
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const noticia = await prisma.noticia.findUnique({
      where: { id: Number(params.id) },
    });

    if (!noticia) {
      return NextResponse.json({ error: 'Noticia no encontrada' }, { status: 404 });
    }

    // Opcional: si solo se deben ver noticias publicadas en esta ruta
    if (!noticia.publicado) {
        return NextResponse.json({ error: 'Noticia no disponible' }, { status: 403 });
    }

    return NextResponse.json(noticia);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al obtener la noticia',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
