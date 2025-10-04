import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle Next.js development stack frames requests
  if (pathname === '/__nextjs_original-stack-frames') {
    // Return a simple 200 response to prevent 404 spam in development
    return new NextResponse(null, { status: 200 })
  }

  // Continue with normal request processing
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/__nextjs_original-stack-frames',
    // Add other paths you want to handle
  ]
}