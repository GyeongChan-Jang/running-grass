'use client'

import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useUserStore } from '@/store/user'
import { useGetUserInfo } from '@/hooks/queries/useGetUserInfo'
import { useEffect } from 'react'
import { logout } from '@/app/auth'
import { Skeleton } from './ui/skeleton'
import { ErrorBoundary } from './errors/ErrorBoundary'
import { ProfileError } from './errors/ProfileError'
import { useQueryError } from '@/hooks/useQueryError'
import { ConfirmAlert } from '@/components/ui/ConfirmAlert'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'
import { StravaStats } from '@/types/strava'

function ProfileSkeleton() {
  return (
    <div className="p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 스켈레톤 */}
          <Skeleton className="w-14 h-14 rounded-full" />
          <div className="space-y-2">
            {/* 이름 스켈레톤 */}
            <Skeleton className="h-5 w-[180px]" />
            {/* 유저네임 스켈레톤 */}
            <Skeleton className="h-4 w-[120px]" />
            {/* 도시/나라 스켈레톤 */}
            <div className="flex gap-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>
        </div>
        {/* 로그아웃 버튼 스켈레톤 */}
        <Skeleton className="h-10 w-10 rounded-md" />
      </div>
      {/* 구분선 스켈레톤 */}
      <Skeleton className="h-[1px] w-full my-6" />
      {/* 통계 정보 스켈레톤 */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-lg">
            <Skeleton className="h-4 w-16 mx-auto mb-2" />
            <Skeleton className="h-5 w-20 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProfileInfoWrapper({
  stats,
  isStatsLoading
}: {
  stats: StravaStats | undefined
  isStatsLoading: boolean
}) {
  return (
    <ErrorBoundary fallback={<ProfileError />}>
      <ProfileInfo stats={stats} isStatsLoading={isStatsLoading} />
    </ErrorBoundary>
  )
}

// 메달 컴포넌트 추가
export function MedalProfile({ distance, profileUrl }: { distance: number; profileUrl: string }) {
  const getMedalStyle = (distance: number) => {
    if (distance >= 3000) {
      return {
        border: 'border-yellow-200 dark:border-yellow-200',
        glow: 'shadow-[0_0_20px_rgba(250,204,21,0.9)] dark:shadow-[0_0_20px_rgba(234,179,8,0.9)]',
        ribbon: 'from-yellow-500 to-yellow-600',
        label: '런고수'
      }
    }
    if (distance >= 1000) {
      return {
        border: 'border-gray-300 dark:border-gray-500',
        glow: 'shadow-[0_0_20px_rgba(156,163,175,0.8)] dark:shadow-[0_0_20px_rgba(156,163,175,0.9)]',
        ribbon: 'from-gray-400 to-gray-500',
        label: '런중수'
      }
    }
    return {
      border: 'border-orange-400 dark:border-orange-400',
      glow: 'shadow-[0_0_20px_rgba(251,146,60,0.9)] dark:shadow-[0_0_20px_rgba(249,115,22,0.9)]',
      ribbon: 'from-orange-600 to-orange-600',
      label: '런린이'
    }
  }

  const medalStyle = getMedalStyle(distance)

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
        <Image
          src={profileUrl || '/images/profile-default.png'}
          alt="Profile"
          fill
          sizes="80px"
          className="rounded-full object-cover"
          priority
        />
      </div>

      {/* 메달 등급 라벨 */}
      <div
        className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap
          bg-white dark:bg-gray-800 px-3 py-1 rounded-full
          text-xs font-bold
          ${medalStyle.border.replace('border-', 'text-')}
          shadow-lg z-30`}
      >
        {medalStyle.label}
      </div>
    </div>
  )
}

function ProfileInfo({ stats, isStatsLoading }: { stats: StravaStats | undefined; isStatsLoading: boolean }) {
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
      toast({
        title: '로그아웃 성공',
        description: '성공적으로 로그아웃 되었습니다.'
      })
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
            <div className="flex items-center gap-1">
              {data?.city && <p className="text-gray-600 dark:text-gray-400">{data?.city},</p>}
              {data?.country && <p className="text-gray-600 dark:text-gray-400">{data?.country}</p>}
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
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 러닝</p>
          <p className="text-md font-bold text-gray-900 dark:text-white text-center">
            {stats?.all_run_totals.count || 0}회
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 거리</p>
          <p className="text-md font-bold text-gray-900 dark:text-white text-center">
            {Math.round((stats?.all_run_totals.distance || 0) / 1000).toLocaleString()}km
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 시간</p>
          <p className="text-md font-bold text-gray-900 dark:text-white text-center">
            {Math.round((stats?.all_run_totals.elapsed_time || 0) / 3600).toLocaleString()}h
          </p>
        </div>
      </div>
      {/* {activities && <ActivityHeatmap activities={activities} />} */}
    </div>
  )
}
