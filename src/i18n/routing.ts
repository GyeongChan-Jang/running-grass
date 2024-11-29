import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const locales = ['en', 'ko'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'ko'

export const routing = defineRouting({
  // 지원하는 모든 로케일 목록
  locales: ['en', 'ko'],

  // 매칭되는 로케일이 없을 때 사용
  defaultLocale: 'ko'
})

// Next.js의 네비게이션 API를 감싸는 경량 래퍼
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
