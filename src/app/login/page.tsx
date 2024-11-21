'use client'

import { Button } from '@/components/ui/button'
import { login } from '@/app/auth'

export default function LoginPage() {
  const handleStravaLogin = () => {
    login()
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">로그인</h2>
          <p className="text-secondary">Strava 계정으로 로그인하여 러닝 기록을 시작하세요</p>
        </div>

        <Button
          onClick={handleStravaLogin}
          size="lg"
          className="w-full text-lg bg-[#FC4C02] hover:bg-[#E34402] h-auto p-6"
        >
          Strava로 계속하기
        </Button>
      </div>
    </div>
  )
}
