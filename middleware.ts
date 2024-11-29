import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

let locales = ['en', 'ko']

// function getLocale(request: NextRequest) {
//   const locale = request.cookies.get('NEXT_LOCALE')?.value
//   return locales.includes(locale) ? locale : 'ko'
// }

export function middleware(request: NextRequest) {
  const stravaToken = request.cookies.get('strava_access_token')

  // 보호된 라우트에 대한 접근 검사
  if (request.nextUrl.pathname.startsWith('/profile') && !stravaToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 이미 로그인한 사용자가 로그인 페이지에 접근하는 경우
  if (request.nextUrl.pathname === '/login' && stravaToken) {
    return NextResponse.redirect(new URL('/profile', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*', '/login']
}
