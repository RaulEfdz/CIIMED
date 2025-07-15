
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// PUT to update a news article
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedNoticia = await prisma.noticia.update({
      where: { id: Number(params.id) },
      data: {
        titulo: data.titulo,
        contenido: data.contenido,
        imagen: data.imagen,
        publicado: data.publicado,
      },
    });
    return NextResponse.json(updatedNoticia);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al actualizar la noticia',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE a news article
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.noticia.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al eliminar la noticia',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
