import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaActivity } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'

const getActivities = async (accessToken: string | null) => {
  if (!accessToken) {
    throw new Error('Access Token이 유효하지 않습니다!')
  }

  const response = await stravaApi.get<StravaActivity[]>('/athlete/activities', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    params: {
      per_page: 200 // 최대한 많은 활동을 가져옴
    }
  })

  return response.data
}

export const useGetActivities = (queryOptions?: UseQueryCustomOptions<StravaActivity[]>) => {
  const { accessToken } = useUserStore()

  return useQuery({
    queryKey: ['activities'],
    queryFn: () => getActivities(accessToken),
    ...queryOptions
  })
}
