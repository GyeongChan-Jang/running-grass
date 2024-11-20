'use client'

import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <html lang="ko">
      <body className={inter.className}>
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg z-50 backdrop-blur-sm hover:scale-110 transition-transform"
          aria-label="테마 변경"
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-gray-800 dark:text-white" />
          ) : (
            <Sun size={20} className="text-gray-800 dark:text-white" />
          )}
        </button>
        <main className="mx-auto max-w-[600px] px-4 relative">{children}</main>
      </body>
    </html>
  )
}
