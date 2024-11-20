'use client'

import { Button } from '@/components/ui/button'
import { getStravaAuthUrl } from '@/lib/strava'

export default function LoginForm() {
  const handleStravaLogin = () => {
    const authUrl = getStravaAuthUrl()
    window.location.href = authUrl
  }

  return (
    <div className="w-full max-w-md space-y-6">
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
  )
}
