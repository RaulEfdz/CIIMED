import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener proyectos de investigación con filtros avanzados
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parámetros de consulta
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const researchLine = searchParams.get('researchLine') || '';
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Construir filtros dinámicos
    const whereClause: any = {};

    // Filtro de publicación
    if (published !== null && published !== '') {
      whereClause.published = published === 'true';
    } else {
      // Por defecto, solo proyectos publicados en la API pública
      whereClause.published = true;
    }

    // Filtros adicionales
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (researchLine) whereClause.researchLine = researchLine;
    if (featured !== null && featured !== '') {
      whereClause.featured = featured === 'true';
    }

    // Búsqueda por texto
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { abstract: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } },
        { area: { contains: search, mode: 'insensitive' } }
      ];

      // Búsqueda en investigador principal (solo si no es null)
      whereClause.OR.push({
        AND: [
          { principalInvestigator: { not: null } },
          { principalInvestigator: { contains: search, mode: 'insensitive' } }
        ]
      });
    }

    // Configurar ordenamiento
    const orderBy: any = {};
    if (sortBy === 'priority') {
      orderBy.priority = sortOrder;
    } else if (sortBy === 'startDate') {
      orderBy.startDate = sortOrder;
    } else if (sortBy === 'progress') {
      orderBy.currentProgress = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    // Get fresh Prisma client
    // Using global prisma client

    // Ejecutar consultas
    const [projects, totalCount] = await Promise.all([
      prisma.researchProject.findMany({
        where: whereClause,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.researchProject.count({ where: whereClause })
    ]);

    // Calcular metadatos de paginación
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Estadísticas adicionales
    const stats = await prisma.researchProject.groupBy({
      by: ['status'],
      where: { published: true },
      _count: { status: true }
    });

    return NextResponse.json({
      success: true,
      projects,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit
      },
      stats: stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>),
      filters: {
        search,
        status,
        category,
        researchLine,
        featured,
        published
      }
    });

  } catch (error) {
    console.error('Error fetching research projects:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener proyectos de investigación',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo proyecto de investigación
export async function POST(req: NextRequest) {
  try {
    // Using global prisma client
    const {
      title,
      slug,
      description,
      abstract,
      objectives,
      researchLine,
      category,
      area,
      status,
      priority,
      tags,
      startDate,
      endDate,
      actualEndDate,
      estimatedDuration,
      currentProgress,
      principalInvestigator,
      coInvestigators,
      budget,
      fundingSource,
      currency,
      currentFunding,
      imageUrl,
      imageAlt,
      imgW,
      imgH,
      documentsUrls,
      publicationsUrls,
      presentationsUrls,
      expectedResults,
      currentResults,
      impactMeasures,
      publications,
      citations,
      institutionalPartners,
      internationalPartners,
      studentParticipants,
      featured,
      published,
      allowPublicView,
      link,
      methodology,
      ethicsApproval,
      equipment,
      software
    } = await req.json();

    // Validaciones básicas
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Título y descripción son requeridos' },
        { status: 400 }
      );
    }

    // Generar slug único si no se proporciona
    let projectSlug = slug;
    if (!projectSlug) {
      projectSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      // Verificar unicidad del slug
      const existingProject = await prisma.researchProject.findUnique({
        where: { slug: projectSlug }
      });
      
      if (existingProject) {
        projectSlug = `${projectSlug}-${Date.now()}`;
      }
    }

    const newProject = await prisma.researchProject.create({
      data: {
        title,
        slug: projectSlug,
        description,
        abstract: abstract || null,
        objectives: objectives || [],
        researchLine: researchLine || null,
        category: category || null,
        area: area || null,
        status: status || 'planning',
        priority: priority || 0,
        tags: tags || [],
        startDate: startDate || null,
        endDate: endDate || null,
        actualEndDate: actualEndDate || null,
        estimatedDuration: estimatedDuration || null,
        currentProgress: currentProgress || 0,
        principalInvestigator: principalInvestigator || null,
        coInvestigators: coInvestigators || [],
        budget: budget ? parseFloat(budget.toString()) : null,
        fundingSource: fundingSource || null,
        currency: currency || 'USD',
        currentFunding: currentFunding ? parseFloat(currentFunding.toString()) : null,
        imageUrl: imageUrl || null,
        imageAlt: imageAlt || null,
        imgW: imgW || null,
        imgH: imgH || null,
        documentsUrls: documentsUrls || [],
        publicationsUrls: publicationsUrls || [],
        presentationsUrls: presentationsUrls || [],
        expectedResults: expectedResults || null,
        currentResults: currentResults || null,
        impactMeasures: impactMeasures || [],
        publications: publications || 0,
        citations: citations || 0,
        institutionalPartners: institutionalPartners || [],
        internationalPartners: internationalPartners || [],
        studentParticipants: studentParticipants || 0,
        featured: featured || false,
        published: published !== undefined ? published : true,
        allowPublicView: allowPublicView !== undefined ? allowPublicView : true,
        link: link || null,
        methodology: methodology || null,
        ethicsApproval: ethicsApproval || null,
        equipment: equipment || [],
        software: software || []
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Proyecto de investigación creado exitosamente',
      project: newProject
    });

  } catch (error: any) {
    console.error('Error creating research project:', error);
    
    // Error de slug duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json(
        { success: false, error: 'El slug ya existe. Por favor, usa uno diferente.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al crear proyecto de investigación' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar múltiples proyectos (operaciones en lote)
export async function PUT(req: NextRequest) {
  try {
    // Using global prisma client
    const { action, projectIds, updates } = await req.json();

    if (!action || !projectIds || !Array.isArray(projectIds)) {
      return NextResponse.json(
        { success: false, error: 'Acción e IDs de proyectos son requeridos' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'updateStatus':
        if (!updates.status) {
          return NextResponse.json(
            { success: false, error: 'Estado es requerido para esta acción' },
            { status: 400 }
          );
        }
        result = await prisma.researchProject.updateMany({
          where: { id: { in: projectIds } },
          data: { status: updates.status, updatedAt: new Date() }
        });
        break;

      case 'toggleFeatured':
        // Para toggle, necesitamos actualizar cada proyecto individualmente
        const projects = await prisma.researchProject.findMany({
          where: { id: { in: projectIds } },
          select: { id: true, featured: true }
        });
        
        const updatePromises = projects.map(project =>
          prisma.researchProject.update({
            where: { id: project.id },
            data: { featured: !project.featured, updatedAt: new Date() }
          })
        );
        
        await Promise.all(updatePromises);
        result = { count: projects.length };
        break;

      case 'togglePublished':
        const publishedProjects = await prisma.researchProject.findMany({
          where: { id: { in: projectIds } },
          select: { id: true, published: true }
        });
        
        const publishUpdatePromises = publishedProjects.map(project =>
          prisma.researchProject.update({
            where: { id: project.id },
            data: { published: !project.published, updatedAt: new Date() }
          })
        );
        
        await Promise.all(publishUpdatePromises);
        result = { count: publishedProjects.length };
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Acción no válida' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `${result.count} proyecto(s) actualizado(s) exitosamente`,
      updatedCount: result.count
    });

  } catch (error) {
    console.error('Error in batch update:', error);
    return NextResponse.json(
      { success: false, error: 'Error en actualización masiva' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar múltiples proyectos
export async function DELETE(req: NextRequest) {
  try {
    // Using global prisma client
    const { projectIds } = await req.json();

    if (!projectIds || !Array.isArray(projectIds)) {
      return NextResponse.json(
        { success: false, error: 'IDs de proyectos son requeridos' },
        { status: 400 }
      );
    }

    const result = await prisma.researchProject.deleteMany({
      where: { id: { in: projectIds } }
    });

    return NextResponse.json({
      success: true,
      message: `${result.count} proyecto(s) eliminado(s) exitosamente`,
      deletedCount: result.count
    });

  } catch (error) {
    console.error('Error deleting research projects:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar proyectos' },
      { status: 500 }
    );
  }
}