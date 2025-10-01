import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/lib/generated/prisma';

const prisma = new PrismaClient();

// GET - Obtener una noticia específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: { id: params.id }
    });

    if (!news) {
      return NextResponse.json(
        { success: false, error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener noticia' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una noticia específica
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar que la noticia existe
    const existingNews = await prisma.news.findUnique({
      where: { id: params.id }
    });

    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: 'Noticia no encontrada' },
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
    if (author !== undefined) updateData.author = author;
    if (readTime !== undefined) updateData.readTime = readTime;
    if (slug !== undefined) updateData.slug = slug;
    if (featured !== undefined) updateData.featured = featured;
    if (published !== undefined) updateData.published = published;
    if (tags !== undefined) updateData.tags = tags;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (publishedAt !== undefined) updateData.publishedAt = new Date(publishedAt);

    const updatedNews = await prisma.news.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      news: updatedNews,
      message: 'Noticia actualizada exitosamente' 
    });
  } catch (error: any) {
    console.error('Error updating news:', error);
    
    // Error de slug duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json(
        { success: false, error: 'El slug ya existe. Por favor, usa uno diferente.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al actualizar noticia' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una noticia específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que la noticia existe
    const existingNews = await prisma.news.findUnique({
      where: { id: params.id }
    });

    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }

    await prisma.news.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Noticia eliminada exitosamente' 
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar noticia' },
      { status: 500 }
    );
  }
}