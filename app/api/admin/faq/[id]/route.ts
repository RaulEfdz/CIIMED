
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// PUT to update a FAQ
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedFaq = await prisma.fAQ.update({
      where: { id: Number(params.id) },
      data: {
        pregunta: data.pregunta,
        respuesta: data.respuesta,
        categoria: data.categoria,
        activa: data.activa,
      },
    });
    return NextResponse.json(updatedFaq);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al actualizar la FAQ',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE a FAQ
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.fAQ.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al eliminar la FAQ',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
