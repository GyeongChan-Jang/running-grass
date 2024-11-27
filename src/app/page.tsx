'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden max-w-[600px] mx-auto">
      {/* Hero Section */}
      <div className="h-[70vh] relative overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/video/running-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end p-10 mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            당신의 러닝을
            <br />더 특별하게
          </h1>
          <p className="text-gray-200 mb-6">
            매일의 러닝을 잔디로 기록하고
            <br />
            성장하는 모습을 한눈에 확인하세요
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto px-10">
        <div className="py-12 space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">🌱 러닝 잔디밭 만들기</h2>
            <p className="text-secondary">
              매일의 러닝을 초록색 잔디로 표현해드립니다. <br />
              꾸준한 러닝으로 나만의 잔디밭을 가꿔보세요.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">🏆 재미로 보는 러너 등급 정보</h2>
            <p className="text-secondary">
              누적 달리기 거리에 따라 🏅메달이 부여됩니다. <br />
              런린이부터 런고수까지, 당신의 성장을 확인하세요.
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="w-full text-lg h-auto p-6 group bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-slate-700/25 hover:-translate-y-0.5"
          >
            <Link href="/login" className="flex items-center justify-between">
              <span>Strava로 시작하기</span>
              <span className="bg-primary-foreground/10 p-2 rounded-xl group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </Button>

          <div className="fixed inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950 -z-10" />
        </div>
      </div>
    </div>
  )
}
