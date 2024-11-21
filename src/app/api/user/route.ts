import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('strava_access_token')
    const refreshToken = cookieStore.get('strava_refresh_token')

    if (!accessToken || !refreshToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    return NextResponse.json({
      accessToken: accessToken.value,
      refreshToken: refreshToken.value
    })
  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json({ error: 'Failed to get tokens' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (request.headers.get('x-action') !== 'logout') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  try {
    const response = NextResponse.json({ success: true })

    // 모든 인증 관련 쿠키 삭제
    response.cookies.delete('strava_access_token')
    response.cookies.delete('strava_refresh_token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
