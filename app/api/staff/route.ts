
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

export async function GET() {
  try {
    const staff = await prisma.equipoDeTrabajo.findMany({
      where: { activo: true },
    });
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
