
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// PUT to update a banner
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const data = await request.json();
    const updatedBanner = await prisma.banner.update({
      where: { id: Number(id) },
      data: {
        titulo: data.titulo,
        imagen: data.imagen,
        link: data.link,
        activo: data.activo,
      },
    });
    return NextResponse.json(updatedBanner);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al actualizar el banner',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE a banner
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    await prisma.banner.delete({
      where: { id: Number(id) },
    });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al eliminar el banner',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
