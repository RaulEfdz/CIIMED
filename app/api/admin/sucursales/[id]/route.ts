
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// PUT to update a branch
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedSucursal = await prisma.sucursal.update({
      where: { id: Number(params.id) },
      data: {
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        horario: data.horario,
        mapaUrl: data.mapaUrl,
        activo: data.activo,
      },
    });
    return NextResponse.json(updatedSucursal);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al actualizar la sucursal',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE a branch
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.sucursal.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al eliminar la sucursal',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
