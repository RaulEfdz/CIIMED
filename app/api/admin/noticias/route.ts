
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// GET all news articles
export async function GET() {
  try {
    const noticias = await prisma.noticia.findMany();
    return NextResponse.json(noticias);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al obtener las noticias',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST a new news article
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newNoticia = await prisma.noticia.create({
      data: {
        titulo: data.titulo,
        contenido: data.contenido,
        imagen: data.imagen,
        publicado: data.publicado,
      },
    });
    return NextResponse.json(newNoticia, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al crear la noticia',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
