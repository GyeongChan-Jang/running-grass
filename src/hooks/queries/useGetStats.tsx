import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaStats } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const STORAGE_KEY = 'strava_stats'

const getStats = async (accessToken: string | null, id: number | undefined) => {
  if (!id) {
    throw new Error('사용자ID가 유효하지 않습니다!')
  }

  if (!accessToken) {
    throw new Error('Access Token이 유효하지 않습니다!')
  }

  try {
    // 로컬 스토리지에서 캐시된 데이터 확인
    const storedData = localStorage.getItem(STORAGE_KEY)
    if (storedData) {
      const { data, timestamp } = JSON.parse(storedData)
      const now = new Date().getTime()
      // 24시간(86400000ms) 이내의 데이터인 경우 캐시된 데이터 반환
      if (now - timestamp < 86400000) {
        return data
      }
    }

    const response = await stravaApi.get<StravaStats>(`/athletes/${id}/stats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (response.status !== 200) {
      throw new Error('Failed to get stats')
    }

    // 새로운 데이터를 로컬 스토리지에 저장
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        data: response.data,
        timestamp: new Date().getTime()
      })
    )

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
