'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@/styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, // 재시도 횟수
        staleTime: 5 * 60 * 1000, // 5분
        refetchOnWindowFocus: false,
        throwOnError: true // ErrorBoundary가 에러를 잡을 수 있도록
      }
    }
  })

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-full bg-gray-50 dark:bg-gray-900" suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  )
}
