
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// GET all banners (active and inactive)
export async function GET() {
  try {
    const banners = await prisma.banner.findMany();
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

// POST a new banner
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newBanner = await prisma.banner.create({
      data: {
        titulo: data.titulo,
        imagen: data.imagen,
        link: data.link,
        activo: data.activo,
      },
    });
    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al crear el banner',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
