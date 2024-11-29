import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  // Define locales and defaultLocale in the middleware
  locales: ['en', 'ko'],
  defaultLocale: 'en'
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'] // Ensure middleware applies correctly
}
