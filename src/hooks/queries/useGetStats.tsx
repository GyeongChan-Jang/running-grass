import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaStats } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'

const getStats = async (accessToken: string | null, id: number | undefined) => {
  if (!id) {
    throw new Error('사용자ID가 유효하지 않습니다!')
  }

  if (!accessToken) {
    throw new Error('Access Token이 유효하지 않습니다!')
  }

  const response = await stravaApi.get<StravaStats>(`/athletes/${id}/stats`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  if (response.status !== 200) {
    throw new Error('Failed to get stats')
  }

  return response.data
}

export const useGetStats = (id: number | undefined, queryOptions?: UseQueryCustomOptions<StravaStats>) => {
  const { accessToken } = useUserStore()

  return useQuery({
    queryKey: ['stats', id],
    queryFn: () => getStats(accessToken, id),
    enabled: !!id,
    ...queryOptions
  })
}
