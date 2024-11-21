import { useUserStore } from '@/store/user'

export async function logout() {
  try {
    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'x-action': 'logout'
      }
    })

    if (!response.ok) {
      throw new Error('Logout failed')
    }

    // Zustand store 초기화
    useUserStore.getState().reset()

    // 홈페이지로 리다이렉트
    window.location.href = '/'
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

const STRAVA_MOBILE_AUTH_URL = 'strava://oauth/mobile/authorize'

export const login = () => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID
  const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI
  const scope = 'read,activity:read_all'

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
}
