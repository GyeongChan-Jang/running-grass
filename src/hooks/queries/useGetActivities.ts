import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaActivity } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'

const PER_PAGE = 200

interface GetActivitiesParams {
  per_page: number
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

export const useGetActivities = (queryOptions?: Partial<UseQueryCustomOptions<StravaActivity[]>>) => {
  const { accessToken } = useUserStore()

  return useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(accessToken, { per_page: PER_PAGE }),
    ...queryOptions
  })
}
