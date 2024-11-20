'use client'

import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useUserStore } from '@/store/user'
import { useGetUserInfo } from '@/hooks/queries/useGetUserInfo'
import { useEffect } from 'react'
import { useGetActivity } from '@/hooks/queries/useGetActivity'
import { logout } from '@/app/auth'
import { Skeleton } from './ui/skeleton'

function ProfileSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 스켈레톤 */}
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            {/* 이름 스켈레톤 */}
            <Skeleton className="h-7 w-[180px]" />
            {/* 유저네임 스켈레톤 */}
            <Skeleton className="h-5 w-[120px]" />
            {/* 도시/나라 스켈레톤 */}
            <div className="flex gap-2">
              <Skeleton className="h-5 w-[80px]" />
              <Skeleton className="h-5 w-[100px]" />
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
          <div key={i} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <Skeleton className="h-4 w-16 mx-auto mb-2" />
            <Skeleton className="h-7 w-20 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ProfileInfo() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const { data, isLoading } = useGetUserInfo()
  const { data: activities, isLoading: isActivitiesLoading } = useGetActivity()

  useEffect(() => {
    if (data) setUser(data)
  }, [data, setUser])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }

  if (isLoading || isActivitiesLoading) {
    return <ProfileSkeleton />
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {data?.profile && <img src={data.profile} alt="Profile" className="w-16 h-16 rounded-full object-cover" />}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {data?.firstname} {data?.lastname}
            </h1>
            {data?.username && <p className="text-gray-600 dark:text-gray-400">@{data?.username}</p>}
            <div className="flex items-center gap-2">
              {data?.city && <p className="text-gray-600 dark:text-gray-400">{data?.city}</p>}
              {data?.country && <p className="text-gray-600 dark:text-gray-400">{data?.country}</p>}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
      <hr className="my-6 border-gray-200 dark:border-gray-700" />
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 러닝</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{activities?.length || 0}회</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 거리</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {Math.round((activities?.reduce((acc, activity) => acc + activity.distance, 0) || 0) / 1000)}km
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">총 시간</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {Math.round((activities?.reduce((acc, activity) => acc + activity.moving_time, 0) || 0) / 3600)}h
          </p>
        </div>
      </div>
    </div>
  )
}
