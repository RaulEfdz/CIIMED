import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los miembros del equipo (público)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')
    const includeInactive = searchParams.get('includeInactive') === 'true'
    
    const where: any = {}
    
    // Filtrar por tipo si se especifica
    if (type && type !== 'all') {
      where.type = type.toUpperCase()
    }
    
    // Solo mostrar activos por defecto, a menos que se solicite incluir inactivos
    if (!includeInactive) {
      where.status = 'ACTIVE'
    }

    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({ teamMembers })

  } catch (error) {
    console.error('Get team members error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo miembro del equipo (admin only)
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación admin
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      type,
      order
    } = await req.json()

    // Validar campos requeridos
    if (!name || !position || !department || !type) {
      return NextResponse.json(
        { error: 'Nombre, posición, departamento y tipo son requeridos' },
        { status: 400 }
      )
    }

    // Validar tipo
    const validTypes = ['DIRECTOR', 'RESEARCHER', 'COLLABORATOR', 'STAFF']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de miembro inválido' },
        { status: 400 }
      )
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        position,
        department,
        email,
        phone,
        bio,
        avatar,
        linkedIn,
        website,
        specialties: specialties || [],
        type,
        order: order || 0
      }
    })

    return NextResponse.json({
      success: true,
      teamMember
    }, { status: 201 })

  } catch (error) {
    console.error('Create team member error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}