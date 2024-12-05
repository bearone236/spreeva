import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { NextResponse } from 'next/server'

export const middleware = auth(req => {
  const isLoggedIn = !!req.auth
  const isAuthRoute = ['/login', '/register'].includes(req.nextUrl.pathname)

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!isLoggedIn && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export default auth

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
