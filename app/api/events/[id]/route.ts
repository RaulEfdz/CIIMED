import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un evento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener evento' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un evento específico
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const {
      title,
      description,
      content,
      imageUrl,
      imageAlt,
      imgW,
      imgH,
      link,
      date,
      time,
      location,
      speaker,
      speakers,
      category,
      slug,
      featured,
      published,
      capacity,
      price,
      currency,
      tags,
      eventDate,
      registrationEnd
    } = await request.json();

    // Verificar que el evento existe
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para actualización (solo campos proporcionados)
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageAlt !== undefined) updateData.imageAlt = imageAlt;
    if (imgW !== undefined) updateData.imgW = imgW;
    if (imgH !== undefined) updateData.imgH = imgH;
    if (link !== undefined) updateData.link = link;
    if (date !== undefined) updateData.date = date;
    if (time !== undefined) updateData.time = time;
    if (location !== undefined) updateData.location = location;
    if (speaker !== undefined) updateData.speaker = speaker;
    if (speakers !== undefined) updateData.speakers = speakers;
    if (category !== undefined) updateData.category = category;
    if (slug !== undefined) updateData.slug = slug;
    if (featured !== undefined) updateData.featured = featured;
    if (published !== undefined) updateData.published = published;
    if (capacity !== undefined) updateData.capacity = capacity;
    if (price !== undefined) updateData.price = price;
    if (currency !== undefined) updateData.currency = currency;
    if (tags !== undefined) updateData.tags = tags;
    if (eventDate !== undefined) updateData.eventDate = new Date(eventDate);
    if (registrationEnd !== undefined) updateData.registrationEnd = registrationEnd ? new Date(registrationEnd) : null;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      event: updatedEvent,
      message: 'Evento actualizado exitosamente' 
    });
  } catch (error: any) {
    console.error('Error updating event:', error);
    
    // Error de slug duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json(
        { success: false, error: 'El slug ya existe. Por favor, usa uno diferente.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al actualizar evento' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un evento específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verificar que el evento existe
    const existingEvent = await prisma.event.findUnique({
      where: { id }
    });

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Evento eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar evento' },
      { status: 500 }
    );
  }
}