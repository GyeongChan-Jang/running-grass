import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaUserInfo } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const STORAGE_KEY = 'strava_user_info'

const getUserInfo = async (accessToken: string | null) => {
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

    const response = await stravaApi.get<StravaUserInfo>('/athlete', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (response.status !== 200) {
      throw new Error('Failed to get user info')
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
      throw new Error('하루 요청 횟수를 초과하였습니다🥲\n내일 다시 시도해주세요!')
    }
    console.error('Failed to get user info:', error)
    throw error
  }
}

export const useGetUserInfo = (queryOptions?: UseQueryCustomOptions<StravaUserInfo, AxiosError>) => {
  const { accessToken } = useUserStore()

  if (!accessToken) {
    throw new Error('로그인 정보가 만료되었습니다🥲\n다시 로그인 해주세요!')
  }

  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo(accessToken),
    ...queryOptions
  })
}
