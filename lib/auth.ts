import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function createAdminToken(adminId: string = 'admin'): string {
  return jwt.sign(
    { adminId, role: 'admin' },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  )
}

export function verifyAdminToken(token: string): { adminId: string; role: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string; role: string }
  } catch {
    return null
  }
}