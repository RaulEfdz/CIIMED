import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener un miembro específico
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const teamMember = await prisma.teamMember.findUnique({
      where: { id }
    })

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Miembro del equipo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ teamMember })

  } catch (error) {
    console.error('Get team member error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar miembro del equipo (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const {
      name,
      position,
      department,
      email,
      phone,
      bio,
      avatar,
      linkedIn,
      website,
      specialties,
      status,
      type,
      order
    } = await req.json()

    // Verificar que el miembro existe
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Miembro del equipo no encontrado' },
        { status: 404 }
      )
    }

    // Validar tipo si se proporciona
    if (type) {
      const validTypes = ['DIRECTOR', 'RESEARCHER', 'COLLABORATOR', 'STAFF']
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          { error: 'Tipo de miembro inválido' },
          { status: 400 }
        )
      }
    }

    // Validar status si se proporciona
    if (status) {
      const validStatuses = ['ACTIVE', 'INACTIVE']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Estado inválido' },
          { status: 400 }
        )
      }
    }

    const updatedMember = await prisma.teamMember.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(position && { position }),
        ...(department && { department }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
        ...(linkedIn !== undefined && { linkedIn }),
        ...(website !== undefined && { website }),
        ...(specialties && { specialties }),
        ...(status && { status }),
        ...(type && { type }),
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json({
      success: true,
      teamMember: updatedMember
    })

  } catch (error) {
    console.error('Update team member error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar miembro del equipo (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verificar que el miembro existe
    const existingMember = await prisma.teamMember.findUnique({
      where: { id }
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Miembro del equipo no encontrado' },
        { status: 404 }
      )
    }

    await prisma.teamMember.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: `Miembro del equipo "${existingMember.name}" eliminado exitosamente`
    })

  } catch (error) {
    console.error('Delete team member error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}