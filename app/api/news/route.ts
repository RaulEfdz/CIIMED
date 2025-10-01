import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las noticias
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search');

    let whereClause: any = {};
    
    if (!includeUnpublished) {
      whereClause.published = true;
    }
    
    if (featured) {
      whereClause.featured = true;
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } }
      ];
    }

    const news = await prisma.news.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' }
      ],
      take: limit
    });

    return NextResponse.json({ 
      success: true, 
      news,
      count: news.length 
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener noticias' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva noticia
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
      author,
      readTime,
      slug,
      featured,
      published,
      tags,
      metaTitle,
      metaDescription,
      publishedAt
    } = await request.json();

    // Validaciones básicas
    if (!title || !description || !author) {
      return NextResponse.json(
        { success: false, error: 'Título, descripción y autor son requeridos' },
        { status: 400 }
      );
    }

    // Generar slug automático si no se proporciona
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .trim();

    const news = await prisma.news.create({
      data: {
        title,
        description,
        content: content || null,
        imageUrl: imageUrl || null,
        imageAlt: imageAlt || null,
        imgW: imgW || null,
        imgH: imgH || null,
        link: link || null,
        author,
        readTime: readTime || '5 min',
        slug: finalSlug,
        featured: featured || false,
        published: published !== undefined ? published : true,
        tags: tags || [],
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      news,
      message: 'Noticia creada exitosamente' 
    });
  } catch (error: any) {
    console.error('Error creating news:', error);
    
    // Error de slug duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json(
        { success: false, error: 'El slug ya existe. Por favor, usa uno diferente.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al crear noticia' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar todas las noticias (bulk update) - no común, pero por consistencia
export async function PUT(request: NextRequest) {
  try {
    const { published } = await request.json();
    
    if (published !== undefined) {
      await prisma.news.updateMany({
        data: { published }
      });
      
      return NextResponse.json({ 
        success: true, 
        message: `Todas las noticias ${published ? 'publicadas' : 'despublicadas'}` 
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'No se proporcionaron datos para actualizar' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error bulk updating news:', error);
    return NextResponse.json(
      { success: false, error: 'Error al actualizar noticias' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar todas las noticias (bulk delete) - peligroso, solo para desarrollo
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
    
    const deletedNews = await prisma.news.deleteMany({});
    
    return NextResponse.json({ 
      success: true, 
      message: `${deletedNews.count} noticias eliminadas` 
    });
  } catch (error) {
    console.error('Error bulk deleting news:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar noticias' },
      { status: 500 }
    );
  }
}