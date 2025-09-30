import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener información institucional específica
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const institutionalInfo = await prisma.institutionalInfo.findUnique({
      where: { id }
    })

    if (!institutionalInfo) {
      return NextResponse.json(
        { error: 'Información institucional no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ institutionalInfo })

  } catch (error) {
    console.error('Get institutional info error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar información institucional (admin only)
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
      description,
      mission,
      vision,
      values,
      history,
      address,
      phone,
      email,
      website,
      foundingYear,
      logo,
      image,
      status
    } = await req.json()

    // Verificar que la información existe
    const existingInfo = await prisma.institutionalInfo.findUnique({
      where: { id }
    })

    if (!existingInfo) {
      return NextResponse.json(
        { error: 'Información institucional no encontrada' },
        { status: 404 }
      )
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

    const updatedInfo = await prisma.institutionalInfo.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(mission !== undefined && { mission }),
        ...(vision !== undefined && { vision }),
        ...(values && { values }),
        ...(history !== undefined && { history }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(foundingYear !== undefined && { foundingYear }),
        ...(logo !== undefined && { logo }),
        ...(image !== undefined && { image }),
        ...(status && { status })
      }
    })

    return NextResponse.json({
      success: true,
      institutionalInfo: updatedInfo
    })

  } catch (error) {
    console.error('Update institutional info error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar información institucional (admin only)
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

    // Verificar que la información existe
    const existingInfo = await prisma.institutionalInfo.findUnique({
      where: { id }
    })

    if (!existingInfo) {
      return NextResponse.json(
        { error: 'Información institucional no encontrada' },
        { status: 404 }
      )
    }

    await prisma.institutionalInfo.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Información institucional eliminada exitosamente'
    })

  } catch (error) {
    console.error('Delete institutional info error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}