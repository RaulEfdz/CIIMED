import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-jwt-super-seguro'

interface ImportTeamMember {
  name: string
  position: string
  department: string
  email?: string
  phone?: string
  bio?: string
  avatar?: string
  linkedIn?: string
  website?: string
  specialties?: string | string[]
  type: 'DIRECTOR' | 'RESEARCHER' | 'COLLABORATOR' | 'STAFF'
  status?: 'ACTIVE' | 'INACTIVE'
  order?: number
}

function validateTeamMember(member: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!member.name || typeof member.name !== 'string' || member.name.trim() === '') {
    errors.push('El nombre es requerido')
  }
  
  if (!member.position || typeof member.position !== 'string' || member.position.trim() === '') {
    errors.push('La posición es requerida')
  }
  
  if (!member.department || typeof member.department !== 'string' || member.department.trim() === '') {
    errors.push('El departamento es requerido')
  }
  
  if (!member.type || !['DIRECTOR', 'RESEARCHER', 'COLLABORATOR', 'STAFF'].includes(member.type)) {
    errors.push('El tipo debe ser: DIRECTOR, RESEARCHER, COLLABORATOR o STAFF')
  }
  
  if (member.email && typeof member.email === 'string' && member.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(member.email)) {
      errors.push('El email no tiene un formato válido')
    }
  }
  
  return { isValid: errors.length === 0, errors }
}

function parseCSV(csvText: string): ImportTeamMember[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) {
    throw new Error('El archivo CSV debe tener al menos un encabezado y una fila de datos')
  }
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const members: ImportTeamMember[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const member: any = {}
    
    headers.forEach((header, index) => {
      const value = values[index] || ''
      
      switch (header) {
        case 'name':
        case 'nombre':
          member.name = value
          break
        case 'position':
        case 'posicion':
        case 'cargo':
          member.position = value
          break
        case 'department':
        case 'departamento':
          member.department = value
          break
        case 'email':
        case 'correo':
          member.email = value || undefined
          break
        case 'phone':
        case 'telefono':
          member.phone = value || undefined
          break
        case 'bio':
        case 'biografia':
          member.bio = value || undefined
          break
        case 'avatar':
        case 'foto':
          member.avatar = value || undefined
          break
        case 'linkedin':
          member.linkedIn = value || undefined
          break
        case 'website':
        case 'sitio':
          member.website = value || undefined
          break
        case 'specialties':
        case 'especialidades':
          member.specialties = value ? value.split(';').map(s => s.trim()).filter(s => s) : []
          break
        case 'type':
        case 'tipo':
          member.type = value.toUpperCase()
          break
        case 'status':
        case 'estado':
          member.status = value.toUpperCase() || 'ACTIVE'
          break
        case 'order':
        case 'orden':
          member.order = value ? parseInt(value) : undefined
          break
      }
    })
    
    if (member.name) {
      members.push(member)
    }
  }
  
  return members
}

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    try {
      jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }
    
    const contentType = req.headers.get('content-type')
    let members: ImportTeamMember[] = []
    
    if (contentType?.includes('application/json')) {
      // Importar JSON
      const body = await req.json()
      
      if (Array.isArray(body)) {
        members = body
      } else if (body.members && Array.isArray(body.members)) {
        members = body.members
      } else {
        return NextResponse.json({ error: 'Formato JSON inválido. Debe ser un array o un objeto con propiedad "members"' }, { status: 400 })
      }
    } else if (contentType?.includes('text/csv')) {
      // Importar CSV
      const csvText = await req.text()
      try {
        members = parseCSV(csvText)
      } catch (error) {
        return NextResponse.json({ error: `Error parsing CSV: ${error instanceof Error ? error.message : 'Error desconocido'}` }, { status: 400 })
      }
    } else {
      return NextResponse.json({ error: 'Tipo de contenido no soportado. Use application/json o text/csv' }, { status: 400 })
    }
    
    if (!members.length) {
      return NextResponse.json({ error: 'No se encontraron miembros para importar' }, { status: 400 })
    }
    
    // Validar cada miembro
    const validationResults = members.map((member, index) => ({
      index,
      member,
      validation: validateTeamMember(member)
    }))
    
    const invalidMembers = validationResults.filter(result => !result.validation.isValid)
    
    if (invalidMembers.length > 0) {
      return NextResponse.json({
        error: 'Errores de validación encontrados',
        details: invalidMembers.map(invalid => ({
          index: invalid.index,
          name: invalid.member.name || 'Sin nombre',
          errors: invalid.validation.errors
        }))
      }, { status: 400 })
    }
    
    // Procesar especialidades
    const processedMembers = members.map(member => ({
      ...member,
      name: member.name.trim(),
      position: member.position.trim(),
      department: member.department.trim(),
      email: member.email?.trim() || undefined,
      phone: member.phone?.trim() || undefined,
      bio: member.bio?.trim() || undefined,
      avatar: member.avatar?.trim() || undefined,
      linkedIn: member.linkedIn?.trim() || undefined,
      website: member.website?.trim() || undefined,
      specialties: Array.isArray(member.specialties) 
        ? member.specialties.filter(s => s && s.trim())
        : typeof member.specialties === 'string' 
          ? member.specialties.split(',').map(s => s.trim()).filter(s => s)
          : [],
      status: member.status || 'ACTIVE',
      order: member.order || 0
    }))
    
    // Insertar en la base de datos
    const results = await Promise.allSettled(
      processedMembers.map(member =>
        prisma.teamMember.create({
          data: member
        })
      )
    )
    
    const successful = results.filter(result => result.status === 'fulfilled').length
    const failed = results.filter(result => result.status === 'rejected')
    
    const response: any = {
      message: `Importación completada: ${successful} miembros importados exitosamente`,
      imported: successful,
      total: members.length
    }
    
    if (failed.length > 0) {
      response.errors = failed.map((result, index) => ({
        index,
        member: processedMembers[index].name,
        error: result.status === 'rejected' ? result.reason?.message || 'Error desconocido' : ''
      }))
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}