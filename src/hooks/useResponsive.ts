import { useState, useEffect } from 'react'

// Tailwind CSS의 screens 설정을 참고하여 브레이크포인트 정의
const breakpoints = {
  mobile: 0,
  tablet: 640,
  desktop: 1024
}

type ScreenSize = 'mobile' | 'tablet' | 'desktop'

export function useResponsive(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>('mobile')

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth

      if (width >= breakpoints.desktop) {
        setScreenSize('desktop')
      } else if (width >= breakpoints.tablet) {
        setScreenSize('tablet')
      } else {
        setScreenSize('mobile')
      }
    }

    // 초기 화면 크기 설정
    updateScreenSize()

    // 윈도우 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', updateScreenSize)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', updateScreenSize)
    }
  }, [])

  return screenSize
}
