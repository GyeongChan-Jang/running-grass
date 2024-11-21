import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaActivity } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'

interface StravaActivityParams {
  before?: number
  after?: number
  page?: number
  per_page?: number
}

const getActivities = async (accessToken: string, params: StravaActivityParams) => {
  try {
    const response = await stravaApi.get<StravaActivity[]>('/athlete/activities', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params
    })

    if (response.status !== 200) {
      throw new Error('Failed to get activities')
    }

    return response.data
  } catch (error) {
    console.error('Failed to get activities:', error)
    throw error
  }
}

export const useGetActivity = (params?: StravaActivityParams, queryOptions?: UseQueryCustomOptions) => {
  const { accessToken } = useUserStore()

  if (!accessToken) {
    throw new Error('Access Token이 유효하지 않습니다!')
  }

  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => getActivities(accessToken, params || {}),
    ...queryOptions
  })
}
