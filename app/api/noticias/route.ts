
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

export async function GET() {
  try {
    const noticias = await prisma.noticia.findMany({
      where: { publicado: true },
      orderBy: {
        createdAt: 'desc',
      },
    });
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
