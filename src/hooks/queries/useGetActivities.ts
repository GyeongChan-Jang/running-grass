import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaActivity } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const PER_PAGE = 200

// 현재 연도와 이전 2년의 시작/종료 시간 계산
export const getCurrentAndPastYears = () => {
  const now = new Date()
  const currentYear = now.getFullYear()

  return [currentYear, currentYear - 1, currentYear - 2].map((year) => ({
    start: new Date(year, 0, 1).getTime() / 1000, // 1월 1일 00:00:00
    end: new Date(year, 11, 31, 23, 59, 59).getTime() / 1000, // 12월 31일 23:59:59
    year
  }))
}

const YEARS_CONFIG = getCurrentAndPastYears()

interface GetActivitiesParams {
  per_page: number
  page: number
  after: number
  before: number
}

const getActivities = async (accessToken: string | null, params: GetActivitiesParams) => {
  if (!accessToken) {
    throw new Error('다시 로그인 해주세요!')
  }

  console.log(
    `Requesting activities from ${new Date(params.after * 1000).toISOString()} to ${new Date(
      params.before * 1000
    ).toISOString()} page: ${params.page}`
  )

  try {
    const response = await stravaApi.get<StravaActivity[]>('/athlete/activities', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params
    })

    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 429) {
      throw new Error('하루 요청 횟수를 초과하였습니다.\n내일 다시 시도해주세요!')
    }
    throw error
  }
}

const getAllActivities = async (accessToken: string | null): Promise<StravaActivity[]> => {
  try {
    let allActivities: StravaActivity[] = []
    const today = new Date()

    // 현재 연도의 캐시 데이터 확인
    const currentYearConfig = YEARS_CONFIG.find((c) => c.year === today.getFullYear())
    if (currentYearConfig) {
      const storageKey = `strava_activities_${currentYearConfig.year}`
      const storedData = localStorage.getItem(storageKey)
      const cachedActivities: StravaActivity[] = storedData ? JSON.parse(storedData) : []

      if (cachedActivities.length > 0) {
        const lastActivityDate = new Date(cachedActivities[cachedActivities.length - 1].start_date)

        // 마지막 활동 날짜와 현재 날짜가 같은 경우
        const isSameDay =
          lastActivityDate.getFullYear() === today.getFullYear() &&
          lastActivityDate.getMonth() === today.getMonth() &&
          lastActivityDate.getDate() === today.getDate()

        if (isSameDay) {
          console.log('Data is up to date, using cached data')
          // 모든 연도의 캐시된 데이터 사용
          for (const yearConfig of YEARS_CONFIG) {
            const yearStorageKey = `strava_activities_${yearConfig.year}`
            const yearStoredData = localStorage.getItem(yearStorageKey)
            if (yearStoredData) {
              allActivities = [...allActivities, ...JSON.parse(yearStoredData)]
            }
          }
          return allActivities.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
        }

        // 마지막 활동 날짜 이후의 데이터만 요청
        console.log('Data after last activity only requested')
        for (const yearConfig of YEARS_CONFIG) {
          const yearStorageKey = `strava_activities_${yearConfig.year}`
          const yearStoredData = localStorage.getItem(yearStorageKey)
          const yearCachedActivities: StravaActivity[] = yearStoredData ? JSON.parse(yearStoredData) : []

          if (yearConfig.year === today.getFullYear()) {
            // 현재 연도는 마지막 활동 이후의 데이터만 요청
            let page = 1
            let yearActivities: StravaActivity[] = []
            let hasMore = true

            while (hasMore) {
              const activities = await getActivities(accessToken, {
                per_page: PER_PAGE,
                page,
                after: Math.floor(lastActivityDate.getTime() / 1000),
                before: yearConfig.end
              })

              if (activities.length === 0) {
                hasMore = false
              } else {
                yearActivities = [...yearActivities, ...activities]
                page++
              }
            }

            if (yearActivities.length > 0) {
              const mergedActivities = [...yearActivities, ...yearCachedActivities]
              const uniqueActivities = Array.from(new Map(mergedActivities.map((item) => [item.id, item])).values())
              const sortedActivities = uniqueActivities.sort(
                (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
              )

              localStorage.setItem(yearStorageKey, JSON.stringify(sortedActivities))
              allActivities = [...allActivities, ...sortedActivities]
            } else {
              allActivities = [...allActivities, ...yearCachedActivities]
            }
          } else {
            // 이전 연도는 캐시된 데이터 사용
            allActivities = [...allActivities, ...yearCachedActivities]
          }
        }
      } else {
        // 캐시된 데이터가 없는 경우 전체 데이터 요청
        console.log('No cached data. Requesting all data')
        for (const yearConfig of YEARS_CONFIG) {
          let page = 1
          let yearActivities: StravaActivity[] = []
          let hasMore = true

          while (hasMore) {
            const activities = await getActivities(accessToken, {
              per_page: PER_PAGE,
              page,
              after: yearConfig.start,
              before: yearConfig.end
            })

            if (activities.length === 0) {
              hasMore = false
            } else {
              yearActivities = [...yearActivities, ...activities]
              page++
            }
          }

          if (yearActivities.length > 0) {
            const sortedActivities = yearActivities.sort(
              (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
            )
            localStorage.setItem(`strava_activities_${yearConfig.year}`, JSON.stringify(sortedActivities))
            allActivities = [...allActivities, ...sortedActivities]
          }
        }
      }
    }

    return allActivities.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
  } catch (error) {
    console.error('Failed to fetch activities:', error)
    return []
  }
}

export const useGetActivities = (queryOptions?: Partial<UseQueryCustomOptions<StravaActivity[]>>) => {
  const { accessToken } = useUserStore()

  return useQuery({
    queryKey: ['activities', YEARS_CONFIG.map((c) => c.year)],
    queryFn: () => getAllActivities(accessToken),
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    ...queryOptions
  })
}
