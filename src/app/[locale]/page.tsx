// 'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('home')
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
            {t('hero.title.line1')}
            <br />
            {t('hero.title.line2')}
          </h1>
          <p className="text-gray-200 mb-6">
            {t('hero.subtitle.line1')}
            <br />
            {t('hero.subtitle.line2')}
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto px-10">
        <div className="py-12 space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl xs:text-xl font-bold">{t('features.grass.title')}</h2>
            <p className="text-md xs:text-sm text-secondary">
              {t('features.grass.description.line1')}
              <br />
              {t('features.grass.description.line2')}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl xs:text-xl font-bold">{t('features.medal.title')}</h2>
            <p className="text-md xs:text-sm text-secondary">
              {t('features.medal.description.line1')}
              <br />
              {t('features.medal.description.line2')}
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="w-full text-lg h-auto p-6 group bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-slate-700/25 hover:-translate-y-0.5"
          >
            <Link href="/login" className="flex items-center justify-between">
              <span>{t('cta.startWithStrava')}</span>
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
