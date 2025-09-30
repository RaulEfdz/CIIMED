import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}