import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes — ไม่ต้อง login
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/r/',
  '/spin/',
  '/api/login',
  '/api/spin',
  '/api/rewards',
  '/api/logout',
]

const ADMIN_ONLY    = ['/admin/']
const MERCHANT_ONLY = ['/merchant/']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p)))
    return NextResponse.next()

  // Allow static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon'))
    return NextResponse.next()

  const token = req.cookies.get('auth_token')?.value
  if (!token) return NextResponse.redirect(new URL('/auth/login', req.url))

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
