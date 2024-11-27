'use client'

import { Button } from '@/components/ui/button'
import { login } from '@/app/auth'
import Image from 'next/image'

export default function LoginPage() {
  const handleStravaLogin = () => {
    login()
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* 배경 이미지 및 오버레이 */}
      <div className="absolute inset-0">
        <Image
          src="/images/running-background.avif" // 러닝 관련 배경 이미지 필요
          alt="Running Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-3xl font-bold text-white whitespace-nowrap">러닝 기록을 시작하세요</h2>
            <p className="text-gray-100 font-semibold text-md">
              Strava 계정으로 로그인하고
              <br />
              나만의 러닝 🌱 잔디밭을 가꿔보세요
            </p>
          </div>

          <Button
            onClick={handleStravaLogin}
            size="lg"
            className="w-full text-lg bg-[#FC4C02] hover:bg-[#E34402] h-auto p-6 
              rounded-xl transition-all duration-300 
              shadow-[0_0_20px_rgba(252,76,2,0.3)]
              hover:shadow-[0_0_30px_rgba(252,76,2,0.5)]
              hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-center gap-3">
              <Image
                className="bg-white rounded-full"
                src="/images/strava.png" // Strava 로고 이미지 필요
                alt="Strava Logo"
                width={40}
                height={40}
              />
              <span className="whitespace-nowrap font-bold text-lg">Strava로 계속하기</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
