'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

import '@/styles/globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Metadata } from 'next'

export const metadata: Metadata = {
  // title: 'Run Daily',
  title: '런데일리',
  // description: 'Visualize your running records like GitHub contribution graph',
  description: '러닝 잔디밭을 확인하세요 🌱',
  openGraph: {
    // title: 'Run Daily',
    title: '런데일리',
    // description: 'Visualize your running records like GitHub contribution graph',
    description: '러닝 잔디밭을 확인하세요 🌱',
    url: 'https://rundaily.vercel.app',
    siteName: '런데일리',
    images: [
      {
        url: 'https://rundaily.vercel.app/og-image.png', // 1200x630px 권장
        width: 1200,
        height: 630,
        alt: '런데일리 미리보기'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: '런데일리',
    // description: 'Visualize your running records like GitHub contribution graph',
    description: '러닝 잔디밭을 확인하세요 🌱',
    images: ['https://rundaily.vercel.app/og-image.png']
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        throwOnError: true
      }
    }
  })

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased')}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <div className="relative">
              {children}
              <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
              </div>
            </div>
          </QueryClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
