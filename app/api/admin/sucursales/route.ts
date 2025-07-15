import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// GET all branches
export async function GET() {
  try {
    const sucursales = await prisma.sucursal.findMany();
    return NextResponse.json(sucursales);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al obtener las sucursales',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST a new branch
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newSucursal = await prisma.sucursal.create({
      data: {
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        horario: data.horario,
        mapaUrl: data.mapaUrl,
        activo: data.activo,
      },
    });
    return NextResponse.json(newSucursal, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al crear la sucursal',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}