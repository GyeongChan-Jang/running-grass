export const STRAVA_AUTH_CONFIG = {
  client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
  redirect_uri: process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI,
  response_type: 'code',
  approval_prompt: 'auto',
  scope: 'read,activity:read_all'
}

export const getStravaAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: STRAVA_AUTH_CONFIG.client_id!,
    redirect_uri: STRAVA_AUTH_CONFIG.redirect_uri!,
    response_type: STRAVA_AUTH_CONFIG.response_type,
    approval_prompt: STRAVA_AUTH_CONFIG.approval_prompt,
    scope: STRAVA_AUTH_CONFIG.scope
  })

  return `https://www.strava.com/oauth/authorize?${params.toString()}`
}
