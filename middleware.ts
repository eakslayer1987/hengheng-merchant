import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS  = ['/auth/login', '/auth/register', '/r/', '/api/login']
const MERCHANT_ONLY = ['/merchant/']
const ADMIN_ONLY    = ['/admin/']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public routes — skip auth
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()
  if (pathname.startsWith('/spin/') || pathname.startsWith('/r/')) return NextResponse.next()
  if (pathname.startsWith('/api/spin') || pathname.startsWith('/api/rewards')) return NextResponse.next()

  const token = req.cookies.get('auth_token')?.value
  if (!token) return NextResponse.redirect(new URL('/auth/login', req.url))

  // Decode JWT without full verify (middleware is edge, no crypto)
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )
    const role = payload?.role

    if (ADMIN_ONLY.some(p => pathname.startsWith(p)) && role !== 'admin')
      return NextResponse.redirect(new URL('/auth/login', req.url))

    if (MERCHANT_ONLY.some(p => pathname.startsWith(p)) && role !== 'merchant' && role !== 'admin')
      return NextResponse.redirect(new URL('/auth/login', req.url))
  } catch {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png|manifest.json).*)'],
}
