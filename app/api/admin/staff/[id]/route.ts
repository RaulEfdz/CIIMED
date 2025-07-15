
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// PUT to update a staff member
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedStaff = await prisma.equipoDeTrabajo.update({
      where: { id: Number(params.id) },
      data: {
        nombre: data.nombre,
        puesto: data.puesto,
        bio: data.bio,
        imagenUrl: data.imagenUrl,
        linkedinUrl: data.linkedinUrl,
        activo: data.activo,
      },
    });
    return NextResponse.json(updatedStaff);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al actualizar el miembro del equipo',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE a staff member
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.equipoDeTrabajo.delete({
      where: { id: Number(params.id) },
    });
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al eliminar el miembro del equipo',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
