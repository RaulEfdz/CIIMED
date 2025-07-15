
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// GET all staff members
export async function GET() {
  try {
    const staff = await prisma.equipoDeTrabajo.findMany();
    return NextResponse.json(staff);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al obtener el equipo de trabajo',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST a new staff member
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newStaff = await prisma.equipoDeTrabajo.create({
      data: {
        nombre: data.nombre,
        puesto: data.puesto,
        bio: data.bio,
        imagenUrl: data.imagenUrl,
        linkedinUrl: data.linkedinUrl,
        activo: data.activo,
      },
    });
    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al crear el miembro del equipo',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
