
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

export async function GET() {
  try {
    const sucursales = await prisma.sucursal.findMany({
      where: { activo: true },
    });
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
