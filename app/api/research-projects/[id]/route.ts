import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un proyecto de investigación específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Using global prisma client
    const project = await prisma.researchProject.findUnique({
      where: { id }
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Proyecto de investigación no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Error fetching research project:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener proyecto de investigación' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un proyecto de investigación específico
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
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
    } = await request.json();

    // Using global prisma client
    
    // Verificar que el proyecto existe
    const existingProject = await prisma.researchProject.findUnique({
      where: { id }
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Proyecto de investigación no encontrado' },
        { status: 404 }
      );
    }

    // Preparar datos para actualización (solo campos proporcionados)
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (abstract !== undefined) updateData.abstract = abstract;
    if (objectives !== undefined) updateData.objectives = objectives;
    if (researchLine !== undefined) updateData.researchLine = researchLine;
    if (category !== undefined) updateData.category = category;
    if (area !== undefined) updateData.area = area;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (tags !== undefined) updateData.tags = tags;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (actualEndDate !== undefined) updateData.actualEndDate = actualEndDate;
    if (estimatedDuration !== undefined) updateData.estimatedDuration = estimatedDuration;
    if (currentProgress !== undefined) updateData.currentProgress = currentProgress;
    if (principalInvestigator !== undefined) updateData.principalInvestigator = principalInvestigator;
    if (coInvestigators !== undefined) updateData.coInvestigators = coInvestigators;
    if (budget !== undefined) updateData.budget = budget ? parseFloat(budget.toString()) : null;
    if (fundingSource !== undefined) updateData.fundingSource = fundingSource;
    if (currency !== undefined) updateData.currency = currency;
    if (currentFunding !== undefined) updateData.currentFunding = currentFunding ? parseFloat(currentFunding.toString()) : null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageAlt !== undefined) updateData.imageAlt = imageAlt;
    if (imgW !== undefined) updateData.imgW = imgW;
    if (imgH !== undefined) updateData.imgH = imgH;
    if (documentsUrls !== undefined) updateData.documentsUrls = documentsUrls;
    if (publicationsUrls !== undefined) updateData.publicationsUrls = publicationsUrls;
    if (presentationsUrls !== undefined) updateData.presentationsUrls = presentationsUrls;
    if (expectedResults !== undefined) updateData.expectedResults = expectedResults;
    if (currentResults !== undefined) updateData.currentResults = currentResults;
    if (impactMeasures !== undefined) updateData.impactMeasures = impactMeasures;
    if (publications !== undefined) updateData.publications = publications;
    if (citations !== undefined) updateData.citations = citations;
    if (institutionalPartners !== undefined) updateData.institutionalPartners = institutionalPartners;
    if (internationalPartners !== undefined) updateData.internationalPartners = internationalPartners;
    if (studentParticipants !== undefined) updateData.studentParticipants = studentParticipants;
    if (featured !== undefined) updateData.featured = featured;
    if (published !== undefined) updateData.published = published;
    if (allowPublicView !== undefined) updateData.allowPublicView = allowPublicView;
    if (link !== undefined) updateData.link = link;
    if (methodology !== undefined) updateData.methodology = methodology;
    if (ethicsApproval !== undefined) updateData.ethicsApproval = ethicsApproval;
    if (equipment !== undefined) updateData.equipment = equipment;
    if (software !== undefined) updateData.software = software;

    // Siempre actualizar timestamp
    updateData.updatedAt = new Date();

    const updatedProject = await prisma.researchProject.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ 
      success: true, 
      project: updatedProject,
      message: 'Proyecto de investigación actualizado exitosamente' 
    });
  } catch (error: any) {
    console.error('Error updating research project:', error);
    
    // Error de slug duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json(
        { success: false, error: 'El slug ya existe. Por favor, usa uno diferente.' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Error al actualizar proyecto de investigación' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un proyecto de investigación específico
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Using global prisma client
    
    // Verificar que el proyecto existe
    const existingProject = await prisma.researchProject.findUnique({
      where: { id }
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Proyecto de investigación no encontrado' },
        { status: 404 }
      );
    }

    await prisma.researchProject.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Proyecto de investigación eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error deleting research project:', error);
    return NextResponse.json(
      { success: false, error: 'Error al eliminar proyecto de investigación' },
      { status: 500 }
    );
  }
}