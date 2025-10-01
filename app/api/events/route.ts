import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todos los eventos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const upcoming = searchParams.get('upcoming') === 'true';

    let whereClause: any = {};
    
    if (!includeUnpublished) {
      whereClause.published = true;
    }
    
    if (featured) {
      whereClause.featured = true;
    }
    
    if (category && category !== 'Todos') {
      whereClause.category = category;
    }
    
    if (upcoming) {
      whereClause.eventDate = {
        gte: new Date()
      };
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
      
      // Only add speaker search if speaker field exists
      if (search) {
        whereClause.OR.push({
          AND: [
            { speaker: { not: null } },
            { speaker: { contains: search, mode: 'insensitive' } }
          ]
        });
      }
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { eventDate: 'asc' }
      ],
      take: limit
    });

    return NextResponse.json({ 
      success: true, 
      events,
      count: events.length 
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener eventos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo evento
export async function POST(request: NextRequest) {
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

    // Validaciones básicas
    if (!title || !description || !date || !time || !location) {
      return NextResponse.json(
        { success: false, error: 'Título, descripción, fecha, hora y ubicación son requeridos' },
        { status: 400 }
      );
    }

    // Generar slug automático si no se proporciona
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .trim();

    // Convertir fecha string a DateTime si es necesario
    let finalEventDate: Date;
    if (eventDate) {
      finalEventDate = new Date(eventDate);
    } else {
      // Intentar convertir la fecha string a DateTime
      finalEventDate = new Date(date);
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        content: content || null,
        imageUrl: imageUrl || null,
        imageAlt: imageAlt || null,
        imgW: imgW || null,
        imgH: imgH || null,
        link: link || null,
        date,
        time,
        location,
        speaker: speaker || null,
        speakers: speakers || [],
        category: category || null,
        slug: finalSlug,
        featured: featured || false,
        published: published !== undefined ? published : true,
        capacity: capacity || null,
        price: price || null,
        currency: currency || 'USD',
        tags: tags || [],
        eventDate: finalEventDate,
        registrationEnd: registrationEnd ? new Date(registrationEnd) : null
      }
    });

    return NextResponse.json({ 
      success: true, 
      event,
      message: 'Evento creado exitosamente' 
    });
  } catch (error: any) {
    console.error('Error creating event:', error);
    
    // Error de slug duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json(
        { success: false, error: 'El slug ya existe. Por favor, usa uno diferente.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al crear evento' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar todos los eventos (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const { published } = await request.json();
    
    if (published !== undefined) {
      await prisma.event.updateMany({
        data: { published }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: `Todos los eventos ${published ? 'publicados' : 'despublicados'}` 
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'No se proporcionaron datos para actualizar' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error bulk updating events:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar eventos' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar todos los eventos (bulk delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const confirmDelete = searchParams.get('confirm') === 'true';
    
    if (!confirmDelete) {
      return NextResponse.json(
        { success: false, error: 'Debe confirmar la eliminación con ?confirm=true' },
        { status: 400 }
      );
    }
    
    const deletedEvents = await prisma.event.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: `${deletedEvents.count} eventos eliminados` 
    });
  } catch (error) {
    console.error('Error bulk deleting events:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar eventos' },
      { status: 500 }
    );
  }
}