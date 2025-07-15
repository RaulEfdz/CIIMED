import { NextResponse } from 'next/server';
import { prisma } from '@/app/data/db';

// GET all FAQs
export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany();
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al obtener las FAQs',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST a new FAQ
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newFaq = await prisma.fAQ.create({
      data: {
        pregunta: data.pregunta,
        respuesta: data.respuesta,
        categoria: data.categoria,
        activa: data.activa,
      },
    });
    return NextResponse.json(newFaq, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Error al crear la FAQ',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}