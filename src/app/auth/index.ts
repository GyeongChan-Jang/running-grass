import { useUserStore } from '@/store/user'
import { toast } from '@/hooks/use-toast'
import { stravaApi } from '@/lib/strava'
import Cookies from 'js-cookie'

export async function logout() {
  try {
    // 서버에 로그아웃 요청 (서버에서 리다이렉트 처리)
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    // 로컬 스토리지 데이터 삭제
    const STORAGE_KEYS = ['strava_activities_2024', 'strava_user_info', 'strava_stats']
    STORAGE_KEYS.forEach((key) => localStorage.removeItem(key))

    // Zustand store 초기화
    setTimeout(() => {
      useUserStore.getState().reset()
    }, 1000)
  } catch (error) {
    console.error('Logout error:', error)
    toast({
      title: '로그아웃 실패',
      description: '로그아웃 중 오류가 발생했습니다.',
      variant: 'destructive'
    })
  }
}

export async function revokeAccess() {
  try {
    // 서버에 revoke 요청
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'X-Revoke-Access': 'true' // revoke 요청임을 나타내는 헤더
      },
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('서비스 연동 해제 중 오류가 발생했습니다.')
    }

    // 로컬 데이터 완전 삭제
    localStorage.clear()

    // Zustand store 초기화
    useUserStore.getState().reset()

    toast({
      title: '서비스 연동 해제 완료',
      description: 'Strava 연동이 해제되었습니다.'
    })

    window.location.href = '/logout'
  } catch (error) {
    console.error('Revoke error:', error)
    toast({
      title: '연동 해제 실패',
      description: 'Strava 연동 해제 중 오류가 발생했습니다.',
      variant: 'destructive'
    })
  }
}

const STRAVA_MOBILE_AUTH_URL = 'strava://oauth/mobile/authorize'

export const login = () => {
  try {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
    const scope = 'read,activity:read_all'

    toast({
      title: 'Strava 로그인',
      description: 'Strava 로그인 페이지로 이동합니다.'
    })

    // 모바일 디바이스 체크
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      // 모바일 딥링크 URL 생성
      const mobileAuthUrl = `${STRAVA_MOBILE_AUTH_URL}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&approval_prompt=auto&scope=${scope}`

      // 앱이 없을 경우를 위한 fallback URL (기존 웹 인증 URL)
      const webAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&approval_prompt=auto&scope=${scope}`

      // Universal Links나 Custom URL Scheme 시도
      const tryApp = () => {
        const now = new Date().getTime()
        setTimeout(() => {
          // 2초 안에 앱이 실행되지 않으면 웹으로 이동
          if (new Date().getTime() - now > 2000) return
          window.location.href = webAuthUrl
        }, 1500)
        window.location.href = mobileAuthUrl
      }

      tryApp()
    } else {
      // 데스크톱에서는 기존 웹 인증 사용
      window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&approval_prompt=auto&scope=${scope}`
    }
  } catch (error) {
    console.error('Login error:', error)
    toast({
      title: '로그인 실패',
      description: '로그인 중 오류가 발생했습니다.',
      variant: 'destructive'
    })
  }
}
