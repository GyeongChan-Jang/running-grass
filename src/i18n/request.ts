import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { headers } from 'next/headers'
import type { Locale } from './routing'

export default getRequestConfig(async () => {
  const headersList = await headers()
  const locale = headersList.get('X-NEXT-INTL-LOCALE') || routing.defaultLocale

  // 유효한 로케일인지 확인
  if (!routing.locales.includes(locale as Locale)) {
    return {
      messages: (await import(`@/messages/${routing.defaultLocale}.json`)).default,
      locale: routing.defaultLocale
    }
  }

  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
    locale
  }
})
