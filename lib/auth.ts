import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { JWTPayload } from '@/types'

const SECRET = process.env.JWT_SECRET || 'change-me'

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, SECRET) as JWTPayload
  } catch {
    return null
  }
}

// ✅ async เพราะ Next.js 14 cookies() เป็น Promise
export async function getAuthUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}
