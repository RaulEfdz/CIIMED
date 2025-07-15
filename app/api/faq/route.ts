
import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { activa: true },
    });
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al obtener las preguntas frecuentes',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
