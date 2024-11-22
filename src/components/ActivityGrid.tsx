'use client'

import { StravaActivity } from '@/types/strava'
import { format, parseISO, eachDayOfInterval, startOfYear, endOfYear } from 'date-fns'
import { useMemo, useState } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Skeleton } from './ui/skeleton'

interface ActivityGridProps {
  activities: StravaActivity[]
  isLoading: boolean
}

export default function ActivityGrid({ activities, isLoading }: ActivityGridProps) {
  // 활동 데이터로부터 연도 목록 추출
  const years = useMemo(() => {
    if (!activities?.length) return []
    const yearSet = new Set(
      activities
        .filter((activity) => activity.type === 'Run')
        .map((activity) => format(parseISO(activity.start_date), 'yyyy'))
    )
    return Array.from(yearSet).sort().reverse()
  }, [activities])

  const [selectedYear, setSelectedYear] = useState(years[0] || new Date().getFullYear().toString())

  // 선택된 연도의 활동 데이터 매핑
  const activityMap = useMemo(() => {
    const map = new Map<string, number>()

    activities
      .filter((activity) => activity.type === 'Run')
      .forEach((activity) => {
        const date = format(parseISO(activity.start_date), 'yyyy-MM-dd')
        if (!date.startsWith(selectedYear)) return
        const distance = activity.distance / 1000
        map.set(date, (map.get(date) || 0) + distance)
      })

    return map
  }, [activities, selectedYear])

  // 선택된 연도의 모든 날짜 생성
  const daysInYear = useMemo(() => {
    const start = startOfYear(new Date(parseInt(selectedYear), 0))
    const end = endOfYear(new Date(parseInt(selectedYear), 0))
    return eachDayOfInterval({ start, end })
  }, [selectedYear])

  const getIntensityColor = (distance: number) => {
    if (distance === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (distance < 5) return 'bg-green-100 dark:bg-green-900'
    if (distance < 10) return 'bg-green-300 dark:bg-green-700'
    if (distance < 15) return 'bg-green-500 dark:bg-green-600'
    return 'bg-green-700 dark:bg-green-500'
  }

  if (isLoading) {
    return <ActivityGridSkeleton />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">활동 기록</h2>
        <ScrollArea className="max-w-[60%]">
          <div className="flex space-x-2 p-1">
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? 'outline' : 'ghost'}
                size="sm"
                onClick={() => setSelectedYear(year)}
                className="flex-shrink-0"
              >
                {year}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {daysInYear.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd')
          const distance = activityMap.get(dateStr) || 0

          return (
            <div
              key={dateStr}
              className={`aspect-square rounded-sm ${getIntensityColor(distance)}
                hover:ring-2 hover:ring-offset-2 hover:ring-green-500/50 
                dark:hover:ring-green-400/50 dark:ring-offset-gray-900
                transition-all duration-200`}
              title={`${dateStr}: ${distance.toFixed(1)}km`}
            />
          )
        })}
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-end gap-2 text-sm">
        <span className="text-xs text-gray-600 dark:text-gray-400">Less</span>
        {[0, 3, 7, 12, 20].map((value) => (
          <div key={value} className={`w-3 h-3 rounded-sm ${getIntensityColor(value)}`} title={`${value}km`} />
        ))}
        <span className="text-xs text-gray-600 dark:text-gray-400">More</span>
      </div>
    </div>
  )
}

function ActivityGridSkeleton() {
  return (
    <div className="space-y-4">
      {/* 헤더 스켈레톤 */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-32" /> {/* 활동 기록 제목 */}
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-16" />
          ))}
        </div>
      </div>

      {/* 요일 레이블 스켈레톤 */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>

      {/* 그리드 셀 스켈레톤 */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 42 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-sm" />
        ))}
      </div>

      {/* 범례 스켈레톤 */}
      <div className="flex items-center justify-end gap-2">
        <Skeleton className="h-4 w-8" /> {/* Less */}
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-3 rounded-sm" />
        ))}
        <Skeleton className="h-4 w-8" /> {/* More */}
      </div>
    </div>
  )
}
