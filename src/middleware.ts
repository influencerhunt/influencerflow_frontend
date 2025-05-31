import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get the token from cookies OR Authorization header
  const cookieToken = request.cookies.get('access_token')?.value
  const authHeader = request.headers.get('authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  
  // Check if we have any token
  const hasToken = !!(cookieToken || headerToken)
  
  // Define protected routes
  const protectedRoutes = ['/dashboard', '/admin', '/profile']
  const authRoutes = ['/login', '/signup']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // For now, let's disable middleware protection since we're using client-side auth
  // TODO: Implement proper server-side auth verification
  // if (isProtectedRoute && !hasToken) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  
  // Redirect to dashboard if accessing auth routes with token
  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 