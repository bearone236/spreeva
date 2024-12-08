import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { NextResponse } from 'next/server'

export default auth(req => {
  const isLoggedIn = !!req.auth
  const isAuthRoute = ['/login'].includes(req.nextUrl.basePath)

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
