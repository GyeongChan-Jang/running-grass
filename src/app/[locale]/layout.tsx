import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import ClientLayout from '../../components/pages/home/client-layout'
import { Locale } from '@/i18n/routing'

export const metadata: Metadata = {
  title: '런잔디',
  description: '러닝 잔디밭을 확인하세요 🌱',
  openGraph: {
    title: '런잔디',
    description: '러닝 잔디밭을 확인하세요 🌱',
    url: 'https://run-daily-eta.vercel.app/',
    siteName: '런잔디',
    images: [
      {
        url: 'https://github.com/user-attachments/assets/4dfa57d0-0c88-46a6-a72e-e8a815343fdb',
        width: 1200,
        height: 630,
        alt: '런잔디 미리보기'
      }
    ],
    locale: 'ko_KR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: '런잔디',
    description: '러닝 잔디밭을 확인하세요 🌱',
    images: ['https://github.com/user-attachments/assets/4dfa57d0-0c88-46a6-a72e-e8a815343fdb']
  }
}
const locales = ['en', 'ko'] as const

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Await params before destructuring
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  let messages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    console.error(error)
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
