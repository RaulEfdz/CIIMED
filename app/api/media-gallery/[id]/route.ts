import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un elemento específico de la galería
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const mediaItem = await prisma.mediaGallery.findUnique({
      where: { id }
    });

    if (!mediaItem) {
      return NextResponse.json(
        { success: false, error: 'Elemento de galería no encontrado' },
        { status: 404 }
      );
    }

    // Incrementar contador de visualizaciones
    await prisma.mediaGallery.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    return NextResponse.json({
      success: true,
      mediaItem
    });

  } catch (error) {
    console.error('Error fetching media item:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener elemento de galería',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar elemento de la galería
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Verificar que el elemento existe
    const existingItem = await prisma.mediaGallery.findUnique({
      where: { id }
    });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Elemento de galería no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el elemento
    await prisma.mediaGallery.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Elemento de galería eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error deleting media item:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar elemento de galería',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH - Incrementar contador de descargas
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { action } = await request.json();

    if (action === 'download') {
      const updatedItem = await prisma.mediaGallery.update({
        where: { id },
        data: { downloads: { increment: 1 } }
      });

      return NextResponse.json({
        success: true,
        message: 'Contador de descargas actualizado',
        downloads: updatedItem.downloads
      });
    }

    return NextResponse.json(
      { success: false, error: 'Acción no válida' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating media item stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar estadísticas',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}