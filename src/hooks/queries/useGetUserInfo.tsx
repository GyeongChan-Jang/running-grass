import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaUserInfo } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const getUserInfo = async (accessToken: string | null) => {
  try {
    const response = await stravaApi.get<StravaUserInfo>('/athlete', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (response.status !== 200) {
      throw new Error('유저 정보를 불러올 수 없습니다!')
    }

    return response.data
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 429) {
      throw new Error('하루 요청 횟수를 초과하였습니다.\n내일 다시 시도해주세요!')
    }
    console.error('유저 정보:', error)
    throw error
  }
}

export const useGetUserInfo = (queryOptions?: UseQueryCustomOptions<StravaUserInfo, AxiosError>) => {
  const { accessToken } = useUserStore()

  if (!accessToken) {
    throw new Error('Access Token이 유효하지 않습니다!')
  }

  return useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo(accessToken),
    ...queryOptions
  })
}
