
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: { activo: true },
    });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al obtener los banners',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
