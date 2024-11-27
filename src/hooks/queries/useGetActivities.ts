import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaActivity } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'

const PER_PAGE = 200
const YEAR_2024_START = 1704067200 // 2024-01-01 00:00:00 UTC
const YEAR_2024_END = 1735689599 // 2024-12-31 23:59:59 UTC

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
  let page = 1
  let allActivities: StravaActivity[] = []
  let hasMore = true

  while (hasMore) {
    const activities = await getActivities(accessToken, {
      per_page: PER_PAGE,
      page,
      after: YEAR_2024_START,
      before: YEAR_2024_END
    })

    if (activities.length === 0) {
      hasMore = false
    } else {
      allActivities = [...allActivities, ...activities]
      page++
    }
  }

  return allActivities
}

export const useGetActivities = (queryOptions?: Partial<UseQueryCustomOptions<StravaActivity[]>>) => {
  const { accessToken } = useUserStore()

  return useQuery({
    queryKey: ['activities', 2024],
    queryFn: () => getAllActivities(accessToken),
    ...queryOptions
  })
}
