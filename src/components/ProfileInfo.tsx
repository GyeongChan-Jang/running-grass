'use client'

import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useUserStore } from '@/store/user'
import { useGetUserInfo } from '@/hooks/queries/useGetUserInfo'
import { useEffect, useState } from 'react'
import { logout } from '@/app/auth'
import { Skeleton } from './ui/skeleton'
import { useQueryError } from '@/hooks/useQueryError'
import { ConfirmAlert } from '@/components/ui/ConfirmAlert'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { StravaStats } from '@/types/strava'
import { MedalInfoAlert } from './MedalInfoAlert'
import { useResponsive } from '@/hooks/useResponsive'

function ProfileSkeleton() {
  const screenSize = useResponsive()
  return (
    <div className={`p-6 rounded-lg shadow-md`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 mt-4">
          {/* 프로필 이미지 스켈레톤 */}
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-2">
            {/* 이름 스켈레톤 */}
            <Skeleton className="h-5 w-[160px]" />
            {/* 유저네임 스켈레톤 */}
            <Skeleton className="h-4 w-[120px]" />
            {/* 도시/나라 스켈레톤 */}
            <div className="flex gap-2">
              <Skeleton className="h-4 w-[60px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
          </div>
        </div>
        {/* 로그아웃 버튼 스켈레톤 */}
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
      {/* 구분선 스켈레톤 */}
      <Skeleton className="h-[1px] w-full my-6" />
      {/* 통계 정보 스켈레톤 */}
      {/* 모바일 일때는 2컬럼 2로우 */}
      {screenSize === 'mobile' ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg">
              <Skeleton className="h-[80px] w-full mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg">
              <Skeleton className="h-[84px] w-[118px] mx-auto" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 메달 컴포넌트 추가
export function MedalProfile({
  distance,
  profileUrl,
  isImage = false
}: {
  distance: number
  profileUrl: string
  isImage?: boolean
}) {
  const [showMedalInfo, setShowMedalInfo] = useState(false)

  const getMedalStyle = (distance: number) => {
    // 천상계러너: 7000km 이상
    if (distance > 7000) {
      return {
        border: 'border-teal-300 dark:border-teal-300',
        glow: 'shadow-[0_0_20px_rgba(94,234,212,0.9)] dark:shadow-[0_0_20px_rgba(45,212,191,0.9)]',
        ribbon: 'from-teal-400 to-teal-500',
        label: '천상계'
      }
    }
    // 런마스터: 5000km 이상
    if (distance > 5000) {
      return {
        border: 'border-lime-400 dark:border-lime-400',
        glow: 'shadow-[0_0_20px_rgba(163,230,53,0.9)] dark:shadow-[0_0_20px_rgba(132,204,22,0.9)]',
        ribbon: 'from-lime-500 to-lime-600',
        label: '런마스터'
      }
    }
    // 런고수: 3000 ~ 5000km
    if (distance >= 3000) {
      return {
        border: 'border-yellow-200 dark:border-yellow-200',
        glow: 'shadow-[0_0_20px_rgba(250,204,21,0.9)] dark:shadow-[0_0_20px_rgba(234,179,8,0.9)]',
        ribbon: 'from-yellow-500 to-yellow-600',
        label: '런고수'
      }
    }
    // 런중수: 1000 ~ 3000km
    if (distance >= 1000) {
      return {
        border: 'border-gray-300 dark:border-gray-500',
        glow: 'shadow-[0_0_20px_rgba(156,163,175,0.8)] dark:shadow-[0_0_20px_rgba(156,163,175,0.9)]',
        ribbon: 'from-gray-400 to-gray-500',
        label: '런중수'
      }
    }
    // 런초보: 500 ~ 1000km
    if (distance >= 500 && distance < 1000) {
      return {
        border: 'border-stone-400 dark:border-stone-400',
        glow: 'shadow-[0_0_20px_rgba(168,162,158,0.9)] dark:shadow-[0_0_20px_rgba(120,113,108,0.9)]',
        ribbon: 'from-stone-500 to-stone-600',
        label: '런초보'
      }
    }

    // 런린이: 0 ~ 500km
    if (distance > 0 && distance < 500) {
      return {
        border: 'border-orange-400 dark:border-orange-400',
        glow: 'shadow-[0_0_20px_rgba(251,146,60,0.9)] dark:shadow-[0_0_20px_rgba(249,115,22,0.9)]',
        ribbon: 'from-orange-600 to-orange-600',
        label: '런린이'
      }
    }

    // 예외처리
    return {
      border: 'border-purple-300 dark:border-purple-400',
      glow: 'shadow-[0_0_20px_rgba(216,180,254,0.8)] dark:shadow-[0_0_20px_rgba(192,132,252,0.9)]',
      ribbon: 'from-purple-400 to-purple-500',
      label: '🥲에러ㅠ'
    }
  }

  const medalStyle = getMedalStyle(distance)

  const getValidImageUrl = (url: string) => {
    if (!url) return '/images/profile-default.png'

    try {
      new URL(url)
      return url
    } catch {
      // 상대 경로인 경우 그대로 사용
      if (url.startsWith('/')) return url
      return '/images/profile-default.png'
    }
  }

  const validProfileUrl = getValidImageUrl(profileUrl)

  if (isImage) {
    return (
      <div className="relative inline-flex flex-col items-center">
        {/* 메달 리본 */}
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-10 
            bg-gradient-to-b ${medalStyle.ribbon} rounded-t-sm z-10`}
        />

        {/* 메달 테두리와 이미지 */}
        <div
          className={`relative w-20 h-20 rounded-full 
            border-[6px] ${medalStyle.border}
            ${medalStyle.glow}
            bg-white dark:bg-gray-800
            overflow-hidden
            z-20
            transition-all duration-300
            hover:scale-105`}
        >
          <Image src={validProfileUrl} alt="Profile" fill sizes="80px" className="rounded-full object-cover" priority />
        </div>

        {/* 메달 등급 라벨 */}
        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap
            bg-white dark:bg-gray-800 px-3 py-1 rounded-full
            text-xs font-bold
            ${medalStyle.border.replace('border-', 'text-')}
            shadow-lg z-30`}
        >
          <span className="text-xs text-center">{medalStyle.label}</span>
          {/* {medalStyle.label} */}
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        className="relative inline-flex flex-col items-center cursor-pointer"
        onClick={() => setShowMedalInfo(true)}
        title="클릭하여 메달 등급 정보 보기"
      >
        {/* 메달 리본 */}
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-10 
            bg-gradient-to-b ${medalStyle.ribbon} rounded-t-sm z-10`}
        />

        {/* 메달 테두리와 이미지 */}
        <div
          className={`relative w-20 h-20 rounded-full 
            border-[6px] ${medalStyle.border}
            ${medalStyle.glow}
            bg-white dark:bg-gray-800
            overflow-hidden
            z-20
            transition-all duration-300
            hover:scale-105`}
        >
          <Image src={validProfileUrl} alt="Profile" fill sizes="80px" className="rounded-full object-cover" priority />
        </div>

        {/* 메달 등급 라벨 */}
        <div
          className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap
            bg-white dark:bg-gray-800 px-3 py-1 rounded-full
            text-xs font-bold
            ${medalStyle.border.replace('border-', 'text-')}
            shadow-lg z-30`}
        >
          <span className="text-xs text-center">{medalStyle.label}</span>
          {/* {medalStyle.label} */}
        </div>
      </div>

      <MedalInfoAlert open={showMedalInfo} onOpenChange={setShowMedalInfo} />
    </>
  )
}

export default function ProfileInfo({
  stats,
  isStatsLoading
}: {
  stats: StravaStats | undefined
  isStatsLoading: boolean
}) {
  const router = useRouter()
  const { setUser } = useUserStore()
  const { onFailure } = useQueryError()

  const { data, isLoading } = useGetUserInfo({
    ...onFailure
  })

  useEffect(() => {
    if (data) setUser(data)
  }, [data, setUser])

  const handleLogout = async () => {
    try {
      await logout()
      router.replace('/')
    } catch (error) {
      console.error('Failed to logout:', error)
      toast({
        title: '로그아웃 실패',
        description: '로그아웃 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    }
  }

  if (isLoading || isStatsLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-6">
          {data?.profile && (
            <MedalProfile
              distance={Math.round((stats?.all_run_totals.distance || 0) / 1000)}
              profileUrl={data.profile}
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {data?.firstname} {data?.lastname}
            </h1>
            {data?.username && <p className="text-gray-600 dark:text-gray-400">@{data?.username}</p>}
            <div className="flex xs:flex-col items-center xs:items-start">
              {data?.city && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {data?.city}
                  {!data?.country && ','}
                </p>
              )}
              {data?.country && <p className="text-sm text-gray-600 dark:text-gray-400">{data?.country}</p>}
            </div>
          </div>
        </div>
        <ConfirmAlert
          title="로그아웃"
          description="정말 로그아웃 하시겠습니까?"
          confirmText="로그아웃"
          onConfirm={handleLogout}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          }
        />
      </div>
      <hr className="my-6 border-gray-200 dark:border-gray-700" />
      <div className="grid grid-cols-4 sm:grid-cols-2 xs:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-md text-gray-500 dark:text-gray-400 mb-1 font-semibold">총 러닝 🏃‍♂️</p>
          <p className="text-md xs:text-sm font-bold text-gray-900 dark:text-white text-center">
            {stats?.all_run_totals.count || 0}회
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-md text-gray-500 dark:text-gray-400 mb-1 font-semibold">총 거리 📏</p>
          <p className="text-md xs:text-sm font-bold text-gray-900 dark:text-white text-center">
            {Math.round((stats?.all_run_totals.distance || 0) / 1000).toLocaleString()}km
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-md text-gray-500 dark:text-gray-400 mb-1 font-semibold">총 시간 🕒</p>
          <p className="text-md xs:text-sm font-bold text-gray-900 dark:text-white text-center">
            {Math.round((stats?.all_run_totals.elapsed_time || 0) / 3600).toLocaleString()}h
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-md text-gray-500 dark:text-gray-400 mb-1 font-semibold">총 고도 ⛰️</p>
          <p className="text-md xs:text-sm font-bold text-gray-900 dark:text-white text-center">
            {Math.round((stats?.all_run_totals.elevation_gain || 0) / 1000).toLocaleString()}km
          </p>
        </div>
      </div>
      {/* {activities && <ActivityHeatmap activities={activities} />} */}
    </div>
  )
}
