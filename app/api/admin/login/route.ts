import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyPassword, createAdminToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    // Verificar contraseña con hash almacenado
    const isValid = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH!)

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    // Crear token JWT
    const token = createAdminToken()

    // Configurar cookie
    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 horas
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('admin-token')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}