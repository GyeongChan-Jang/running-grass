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
    if (distance === 0) return 'bg-gray-200 dark:bg-gray-700/80'
    if (distance < 5) return 'bg-green-100/90 dark:bg-green-900/80'
    if (distance < 10) return 'bg-green-300/90 dark:bg-green-700/90'
    if (distance < 15) return 'bg-green-500/90 dark:bg-green-600/90'
    return 'bg-green-700/90 dark:bg-green-500'
  }

  return (
    <div className="w-full overflow-x-auto mt-8">
      <div className="min-w-max p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col gap-2">
          {Array.from(new Set(years.map((date) => format(date, 'yyyy')))).map((year) => (
            <div key={year} className="flex flex-col gap-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{year}</h3>
              <div className="grid grid-cols-53 gap-1">
                {years
                  .filter((date) => format(date, 'yyyy') === year)
                  .map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd')
                    const distance = activityMap.get(dateStr) || 0

                    return (
                      <div
                        key={dateStr}
                        className={`w-3 h-3 rounded-sm ${getIntensityColor(distance)} 
                          hover:ring-2 hover:ring-offset-2 hover:ring-green-500/50 
                          dark:hover:ring-green-400/50 dark:ring-offset-gray-900
                          transition-all duration-200
                          border border-gray-300/10 dark:border-gray-600/20`}
                        title={`${dateStr}: ${distance.toFixed(1)}km`}
                      />
                    )
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="mt-6 flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-300">Less</span>
          <div
            className={`w-3 h-3 rounded-sm ${getIntensityColor(0)} border border-gray-300/10 dark:border-gray-600/20`}
          />
          <div
            className={`w-3 h-3 rounded-sm ${getIntensityColor(3)} border border-gray-300/10 dark:border-gray-600/20`}
          />
          <div
            className={`w-3 h-3 rounded-sm ${getIntensityColor(7)} border border-gray-300/10 dark:border-gray-600/20`}
          />
          <div
            className={`w-3 h-3 rounded-sm ${getIntensityColor(12)} border border-gray-300/10 dark:border-gray-600/20`}
          />
          <div
            className={`w-3 h-3 rounded-sm ${getIntensityColor(20)} border border-gray-300/10 dark:border-gray-600/20`}
          />
          <span className="text-xs text-gray-600 dark:text-gray-300">More</span>
        </div>
      </div>
    </div>
  )
}
