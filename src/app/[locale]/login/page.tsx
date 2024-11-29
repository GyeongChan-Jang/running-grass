'use client'

import { Button } from '@/components/ui/button'
import { login } from '@/app/auth'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const t = useTranslations('login')

  const handleStravaLogin = () => {
    login()
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* 배경 이미지 및 오버레이 */}
      <div className="absolute inset-0">
        <Image src="/images/running-background.avif" alt="Running Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center space-y-4 mb-8">
            <h2 className="sm:text-2xl md:text-3xl text-xl font-bold text-white whitespace-pre-line">{t('title')}</h2>
            <p className="text-gray-100 font-semibold text-md">
              {t('subtitle.line1')}
              <br />
              {t('subtitle.line2')}
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
                src="/images/strava.png"
                alt="Strava Logo"
                width={40}
                height={40}
              />
              <span className="whitespace-nowrap font-bold">{t('button')}</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
