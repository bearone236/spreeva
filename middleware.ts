import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const adminOnlyPathRegexs = [/^\/organization\/dashboard\/.*$/, /^\/xxx\/.*$/]

export default auth(async (req: NextRequest) => {
  const { pathname } = req.nextUrl

  const token =
    req.cookies.get('next-auth.session-token') ||
    req.cookies.get('__Secure-next-auth.session-token')
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const decodedToken = JSON.parse(
    Buffer.from(token.value.split('.')[1], 'base64').toString(),
  )

  const userRole = decodedToken.userType
  const provider = decodedToken.provider

  // Googleプロバイダーのユーザーに対して、admin や member の画面にアクセスできないようにする
  if (
    provider === 'google' &&
    (pathname.startsWith('/organization') ||
      pathname.startsWith('/organization/dashboard'))
  ) {
    return NextResponse.redirect(new URL('/404', req.url))
  }

  if (
    adminOnlyPathRegexs.some(regex => regex.test(pathname)) &&
    userRole !== 'admin'
  ) {
    return NextResponse.redirect(new URL('/404', req.url))
  }

  if (userRole === 'admin' && pathname === '/login') {
    return NextResponse.redirect(new URL('/organization/dashboard', req.url))
  }

  if (userRole === 'member' && pathname === '/login') {
    return NextResponse.redirect(new URL('/organization', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
