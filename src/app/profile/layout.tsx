'use client'

import { useUserStore } from '@/store/user'
import React, { useEffect, useState } from 'react'
import { getToken } from '../auth/getToken'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const { setAccessToken } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const initializeAuth = async () => {
      try {
        const token = await getToken()
        if (!token) {
          router.push('/login')
          return
        }
        setAccessToken(token.accessToken)
      } catch (error) {
        console.error('Failed to get token:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [setAccessToken, router, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return <div className="container mx-auto max-w-[600px]">{children}</div>
}

export default ProfileLayout
