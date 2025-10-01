import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener elementos de la galería de medios con filtros avanzados
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parámetros de consulta
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const collection = searchParams.get('collection') || '';
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const quality = searchParams.get('quality') || '';
    
    // Filtros para la consulta
    const whereClause: any = {};
    
    // Filtro de búsqueda general
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
        { keywords: { hasSome: [search] } }
      ];
    }
    
    // Filtros específicos
    if (type) {
      whereClause.type = type;
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (subcategory) {
      whereClause.subcategory = subcategory;
    }
    
    if (collection) {
      whereClause.collection = collection;
    }
    
    if (featured !== null) {
      whereClause.featured = featured === 'true';
    }
    
    if (published !== null) {
      whereClause.published = published === 'true';
    } else {
      // Por defecto solo mostrar publicados
      whereClause.published = true;
    }
    
    if (quality) {
      whereClause.quality = quality;
    }
    
    // Filtro para mostrar en galería
    whereClause.showInGallery = true;
    
    // Calcular offset para paginación
    const offset = (page - 1) * limit;
    
    // Obtener elementos de la galería con paginación
    const mediaItems = await prisma.mediaGallery.findMany({
      where: whereClause,
      orderBy: [
        { featured: 'desc' },  // Destacados primero
        { priority: 'desc' },  // Mayor prioridad primero
        { order: 'asc' },      // Orden personalizado
        { createdAt: 'desc' }  // Más recientes después
      ],
      skip: offset,
      take: limit
    });
    
    // Contar total de elementos para paginación
    const totalCount = await prisma.mediaGallery.count({
      where: whereClause
    });
    
    // Calcular información de paginación
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    // Obtener estadísticas adicionales
    const stats = await prisma.mediaGallery.groupBy({
      by: ['type'],
      where: { published: true, showInGallery: true },
      _count: { type: true }
    });
    
    // Obtener categorías únicas para filtros
    const categories = await prisma.mediaGallery.findMany({
      where: { published: true, showInGallery: true },
      select: { category: true },
      distinct: ['category']
    });
    
    // Obtener colecciones únicas
    const collections = await prisma.mediaGallery.findMany({
      where: { published: true, showInGallery: true },
      select: { collection: true },
      distinct: ['collection']
    });

    return NextResponse.json({
      success: true,
      mediaItems,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      },
      stats: {
        byType: stats.reduce((acc, item) => {
          acc[item.type.toLowerCase()] = item._count.type;
          return acc;
        }, {} as Record<string, number>),
        total: totalCount
      },
      filters: {
        search,
        type,
        category,
        subcategory,
        collection,
        featured: featured === 'true' ? true : featured === 'false' ? false : null,
        published: published === 'true' ? true : published === 'false' ? false : null,
        quality
      },
      meta: {
        availableCategories: categories.map(c => c.category).filter(Boolean),
        availableCollections: collections.map(c => c.collection).filter(Boolean)
      }
    });

  } catch (error) {
    console.error('Error fetching media gallery:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener elementos de la galería',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo elemento en la galería
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validaciones básicas
    if (!data.title || !data.fileUrl || !data.type) {
      return NextResponse.json(
        { success: false, error: 'Título, URL del archivo y tipo son requeridos' },
        { status: 400 }
      );
    }
    
    // Generar slug único
    let slug = data.slug || data.title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    // Verificar si el slug existe y hacerlo único
    const existingMedia = await prisma.mediaGallery.findFirst({
      where: { slug }
    });
    
    if (existingMedia) {
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
    }
    
    // Crear nuevo elemento de galería
    const newMediaItem = await prisma.mediaGallery.create({
      data: {
        // Información básica
        title: data.title,
        slug,
        description: data.description || '',
        alt: data.alt || data.title,
        
        // Tipo y categorización
        type: data.type,
        category: data.category || null,
        subcategory: data.subcategory || null,
        tags: data.tags || [],
        
        // URLs y archivos
        fileUrl: data.fileUrl,
        thumbnailUrl: data.thumbnailUrl || null,
        previewUrl: data.previewUrl || null,
        
        // Metadatos del archivo
        fileName: data.fileName || null,
        fileSize: data.fileSize || null,
        mimeType: data.mimeType || null,
        duration: data.duration || null,
        
        // Dimensiones
        width: data.width || null,
        height: data.height || null,
        aspectRatio: data.aspectRatio || null,
        
        // Información de contexto
        author: data.author || null,
        source: data.source || null,
        copyright: data.copyright || null,
        license: data.license || null,
        
        // Ubicación y fecha
        location: data.location || null,
        capturedAt: data.capturedAt ? new Date(data.capturedAt) : null,
        eventDate: data.eventDate || null,
        
        // Configuración y estado
        featured: data.featured || false,
        published: data.published !== undefined ? data.published : true,
        allowDownload: data.allowDownload || false,
        quality: data.quality || 'HIGH',
        
        // Organización
        collection: data.collection || null,
        albumId: data.albumId || null,
        order: data.order || 0,
        priority: data.priority || 0,
        
        // Enlaces
        relatedLink: data.relatedLink || null,
        externalUrl: data.externalUrl || null,
        
        // SEO
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        keywords: data.keywords || [],
        
        // Configuración de visualización
        showInGallery: data.showInGallery !== undefined ? data.showInGallery : true,
        showInSlideshow: data.showInSlideshow || false,
        allowComments: data.allowComments || false
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Elemento de galería creado exitosamente',
      mediaItem: newMediaItem
    });

  } catch (error) {
    console.error('Error creating media item:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear elemento de galería',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Actualizar elemento existente
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.id) {
      return NextResponse.json(
        { success: false, error: 'ID del elemento es requerido para actualizar' },
        { status: 400 }
      );
    }
    
    // Verificar que el elemento existe
    const existingItem = await prisma.mediaGallery.findUnique({
      where: { id: data.id }
    });
    
    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: 'Elemento no encontrado' },
        { status: 404 }
      );
    }
    
    // Actualizar slug si cambió el título
    let slug = existingItem.slug;
    if (data.title && data.title !== existingItem.title) {
      slug = data.title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Verificar unicidad del nuevo slug
      const slugExists = await prisma.mediaGallery.findFirst({
        where: { 
          slug,
          id: { not: data.id }
        }
      });
      
      if (slugExists) {
        const timestamp = Date.now();
        slug = `${slug}-${timestamp}`;
      }
    }
    
    // Actualizar elemento
    const updatedMediaItem = await prisma.mediaGallery.update({
      where: { id: data.id },
      data: {
        // Solo actualizar campos que se envían
        ...(data.title && { title: data.title }),
        ...(slug !== existingItem.slug && { slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.alt !== undefined && { alt: data.alt }),
        ...(data.type && { type: data.type }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.subcategory !== undefined && { subcategory: data.subcategory }),
        ...(data.tags !== undefined && { tags: data.tags }),
        ...(data.fileUrl && { fileUrl: data.fileUrl }),
        ...(data.thumbnailUrl !== undefined && { thumbnailUrl: data.thumbnailUrl }),
        ...(data.previewUrl !== undefined && { previewUrl: data.previewUrl }),
        ...(data.fileName !== undefined && { fileName: data.fileName }),
        ...(data.fileSize !== undefined && { fileSize: data.fileSize }),
        ...(data.mimeType !== undefined && { mimeType: data.mimeType }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.width !== undefined && { width: data.width }),
        ...(data.height !== undefined && { height: data.height }),
        ...(data.aspectRatio !== undefined && { aspectRatio: data.aspectRatio }),
        ...(data.author !== undefined && { author: data.author }),
        ...(data.source !== undefined && { source: data.source }),
        ...(data.copyright !== undefined && { copyright: data.copyright }),
        ...(data.license !== undefined && { license: data.license }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.capturedAt !== undefined && { capturedAt: data.capturedAt ? new Date(data.capturedAt) : null }),
        ...(data.eventDate !== undefined && { eventDate: data.eventDate }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.published !== undefined && { published: data.published }),
        ...(data.allowDownload !== undefined && { allowDownload: data.allowDownload }),
        ...(data.quality && { quality: data.quality }),
        ...(data.collection !== undefined && { collection: data.collection }),
        ...(data.albumId !== undefined && { albumId: data.albumId }),
        ...(data.order !== undefined && { order: data.order }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.relatedLink !== undefined && { relatedLink: data.relatedLink }),
        ...(data.externalUrl !== undefined && { externalUrl: data.externalUrl }),
        ...(data.metaTitle !== undefined && { metaTitle: data.metaTitle }),
        ...(data.metaDescription !== undefined && { metaDescription: data.metaDescription }),
        ...(data.keywords !== undefined && { keywords: data.keywords }),
        ...(data.showInGallery !== undefined && { showInGallery: data.showInGallery }),
        ...(data.showInSlideshow !== undefined && { showInSlideshow: data.showInSlideshow }),
        ...(data.allowComments !== undefined && { allowComments: data.allowComments }),
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Elemento de galería actualizado exitosamente',
      mediaItem: updatedMediaItem
    });

  } catch (error) {
    console.error('Error updating media item:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar elemento de galería',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}