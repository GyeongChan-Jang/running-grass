import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaActivity } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'

const PER_PAGE = 200
const YEAR_2024_START = 1704067200 // 2024-01-01 00:00:00 UTC
const YEAR_2024_END = 1735689599 // 2024-12-31 23:59:59 UTC
const STORAGE_KEY = 'strava_activities_2024'

interface GetActivitiesParams {
  per_page: number
  page: number
  after: number
  before: number
}

const getActivities = async (accessToken: string | null, params: GetActivitiesParams) => {
  if (!accessToken) {
    throw new Error('Access Token이 유효하지 않습니다!')
  }

  try {
    const response = await stravaApi.get<StravaActivity[]>('/athlete/activities', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params
    })

    return response.data
  } catch (error) {
    console.error('Failed to get activities:', error)
    throw error
  }
}

const getAllActivities = async (accessToken: string | null): Promise<StravaActivity[]> => {
  // 로컬 스토리지에서 기존 데이터 확인
  const storedData = localStorage.getItem(STORAGE_KEY)
  const cachedActivities: StravaActivity[] = storedData ? JSON.parse(storedData) : []

  // 마지막 활동 시간 확인
  const lastActivityTime = cachedActivities.length > 0 
    ? new Date(cachedActivities[0].start_date).getTime() / 1000 
    : YEAR_2024_START

  console.log('lastActivityTime', lastActivityTime)

  let page = 1
  let allActivities: StravaActivity[] = []
  let hasMore = true

  // 마지막 활동 이후의 데이터만 요청
  while (hasMore) {
    const activities = await getActivities(accessToken, {
      per_page: PER_PAGE,
      page,
      after: lastActivityTime,
      before: YEAR_2024_END
    })

    if (activities.length === 0) {
      hasMore = false
    } else {
      allActivities = [...allActivities, ...activities]
      page++
    }
  }

  // 새로운 활동이 있는 경우에만 캐시 업데이트
  if (allActivities.length > 0) {
    const mergedActivities = [...allActivities, ...cachedActivities]
    // 중복 제거 (start_date 기준)
    const uniqueActivities = Array.from(new Map(mergedActivities.map((item) => [item.start_date, item])).values())
    // 날짜순 정렬
    const sortedActivities = uniqueActivities.sort(
      (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedActivities))
    return sortedActivities
  }

  return cachedActivities
}

export const useGetActivities = (queryOptions?: Partial<UseQueryCustomOptions<StravaActivity[]>>) => {
  const { accessToken } = useUserStore()

  return useQuery({
    queryKey: ['activities', 2024],
    queryFn: () => getAllActivities(accessToken),
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    ...queryOptions
  })
}
