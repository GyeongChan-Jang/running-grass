import { StravaUserInfo } from '@/types/strava'
import { create } from 'zustand'

interface UserState {
  user: StravaUserInfo | null
  accessToken: string | null
  refreshToken: string | null
  setUser: (user: StravaUserInfo) => void
  setAccessToken: (token: string) => void
  setRefreshToken: (token: string) => void
  reset: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setUser: (user: StravaUserInfo) => set({ user }),
  setAccessToken: (token: string) => set({ accessToken: token }),
  setRefreshToken: (token: string) => set({ refreshToken: token }),
  reset: () => set({ user: null, accessToken: null, refreshToken: null })
}))
