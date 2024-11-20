'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import '@/styles/globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()

  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-full bg-gray-50 dark:bg-gray-900" suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </body>
    </html>
  )
}
