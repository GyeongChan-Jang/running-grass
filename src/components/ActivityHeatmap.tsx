import { StravaActivity } from '@/types/strava'
import { format, parseISO, eachDayOfInterval, startOfYear, endOfYear } from 'date-fns'
import { useMemo } from 'react'

interface ActivityHeatmapProps {
  activities: StravaActivity[]
}

export function ActivityHeatmap({ activities }: ActivityHeatmapProps) {
  const activityMap = useMemo(() => {
    const map = new Map<string, number>()

    activities.forEach((activity) => {
      if (activity.type !== 'Run') return

      const date = format(parseISO(activity.start_date), 'yyyy-MM-dd')
      const distance = activity.distance / 1000 // km로 변환

      map.set(date, (map.get(date) || 0) + distance)
    })

    return map
  }, [activities])

  const years = useMemo(() => {
    if (!activities.length) return []

    const oldestDate = parseISO(activities[activities.length - 1].start_date)
    const startYear = startOfYear(oldestDate)
    const endYear = endOfYear(new Date())

    return eachDayOfInterval({ start: startYear, end: endYear })
  }, [activities])

  const getIntensityColor = (distance: number) => {
    if (distance === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (distance < 5) return 'bg-green-100 dark:bg-green-900'
    if (distance < 10) return 'bg-green-300 dark:bg-green-700'
    if (distance < 15) return 'bg-green-500 dark:bg-green-500'
    return 'bg-green-700 dark:bg-green-300'
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max p-4">
        <div className="flex flex-col gap-2">
          {/* 연도별 그룹 */}
          {Array.from(new Set(years.map((date) => format(date, 'yyyy')))).map((year) => (
            <div key={year} className="flex flex-col gap-1">
              <h3 className="text-sm font-medium">{year}</h3>
              <div className="grid grid-cols-53 gap-1">
                {years
                  .filter((date) => format(date, 'yyyy') === year)
                  .map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd')
                    const distance = activityMap.get(dateStr) || 0

                    return (
                      <div
                        key={dateStr}
                        className={`w-3 h-3 rounded-sm ${getIntensityColor(distance)}`}
                        title={`${dateStr}: ${distance.toFixed(1)}km`}
                      />
                    )
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-gray-500">Less</span>
          <div className={`w-3 h-3 rounded-sm ${getIntensityColor(0)}`} />
          <div className={`w-3 h-3 rounded-sm ${getIntensityColor(3)}`} />
          <div className={`w-3 h-3 rounded-sm ${getIntensityColor(7)}`} />
          <div className={`w-3 h-3 rounded-sm ${getIntensityColor(12)}`} />
          <div className={`w-3 h-3 rounded-sm ${getIntensityColor(20)}`} />
          <span className="text-xs text-gray-500">More</span>
        </div>
      </div>
    </div>
  )
}
