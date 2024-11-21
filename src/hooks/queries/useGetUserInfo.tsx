import { stravaApi } from '@/lib/strava'
import { useUserStore } from '@/store/user'
import { UseQueryCustomOptions } from '@/types/common'
import { StravaUserInfo } from '@/types/strava'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

const getUserInfo = async (accessToken: string) => {
  try {
    const response = await stravaApi.get<StravaUserInfo>('/athlete', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (response.status !== 200) {
      throw new Error('Failed to get user info')
    }

    return response.data
  } catch (error) {
    console.error('Failed to get user info:', error)
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
