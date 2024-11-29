import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaStats } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const getStats = async (accessToken: string | null, id: number | undefined) => {
  if (!id) {
    throw new Error('사용자ID가 유효하지 않습니다.\n다시 로그인해주세요!')
  }

  if (!accessToken) {
    throw new Error('로그인 상태가 아닙니다.\n다시 로그인해주세요!')
  }

  try {
    const response = await stravaApi.get<StravaStats>(`/athletes/${id}/stats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (response.status !== 200) {
      throw new Error('통계 데이터를 불러올 수 없습니다.\n다시 시도해주세요!')
    }

    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 429) {
      throw new Error('하루 요청 횟수를 초과하였습니다.\n내일 다시 시도해주세요!')
    }
    throw error
  }
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
