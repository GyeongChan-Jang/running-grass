import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen -mx-4">
      {/* Hero Section */}
      <div className="h-[70vh] relative overflow-hidden">
        <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
          <source src="/video/running-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6 max-w-[600px] mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">
            매일의 러닝을
            <br />
            기록하세요
          </h1>
          <p className="text-gray-200 mb-6">
            Strava와 연동하여 당신의 러닝 여정을
            <br />
            특별하게 시각화해드립니다
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-[600px] mx-auto px-4">
        <div className="py-12 space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">러닝 기록을 시각화</h2>
            <p className="text-secondary">GitHub의 잔디처럼 매일의 러닝을 기록하고 시각화하여 보여줍니다.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">소셜 미디어 공유</h2>
            <p className="text-secondary">나만의 러닝 기록을 이미지로 만들어 소셜 미디어에 공유할 수 있습니다.</p>
          </div>

          <Button
            asChild
            size="lg"
            className="w-full text-lg h-auto p-6 group bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-slate-700/25 hover:-translate-y-0.5"
          >
            <Link href="/login" className="flex items-center justify-between">
              <span>시작하기</span>
              <span className="bg-primary-foreground/10 p-2 rounded-xl group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
          </Button>

          {/* Optional: Add subtle gradient background to the features section */}
          <div className="fixed inset-0 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-950 -z-10" />
        </div>
      </div>
    </div>
  )
}
