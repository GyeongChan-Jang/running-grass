import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    // Deauthorize 처리 후 revoke 하는 건 로그아웃이 아니고 서비스 탈퇴에서 구현
    // const accessToken = cookieStore.get('strava_access_token')?.value
    // const isRevoke = request.headers.get('X-Revoke-Access') === 'true'
    // if (accessToken && isRevoke) {
    //   try {
    //     await stravaApi.post('https://www.strava.com/oauth/deauthorize', null, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`
    //       }
    //     })
    //   } catch (error) {
    //     console.error('Strava deauthorize failed:', error)
    //   }
    // }

    // 쿠키 삭제
    cookieStore.delete('strava_access_token')
    cookieStore.delete('strava_refresh_token')

    // 성공 시 홈페이지로 직접 리다이렉트
    return NextResponse.redirect(new URL('/', request.url), {
      status: 303
    })
  } catch (error) {
    console.error('Logout/Revoke failed:', error)
    return NextResponse.json({ success: false, message: '처리 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
