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
