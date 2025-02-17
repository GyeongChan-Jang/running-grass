'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/toaster'

import '@/styles/globals.css'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        throwOnError: true
      }
    }
  })

  return (
    <html lang="ko" suppressHydrationWarning>
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
