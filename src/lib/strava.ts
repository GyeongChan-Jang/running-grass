import axios from 'axios'

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

export const stravaApi = axios.create({
  baseURL: 'https://www.strava.com/api/v3'
})

export interface StravaAthlete {
  id: number
  username: string
  firstname: string
  lastname: string
  profile: string // profile image url
  stats?: {
    all_run_totals: {
      count: number
      distance: number
      moving_time: number
    }
  }
}

export const getAthleteProfile = async (accessToken: string): Promise<StravaAthlete> => {
  const { data } = await stravaApi.get('/athlete', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })

  return data
}

export const getAthleteStats = async (accessToken: string, athleteId: number) => {
  const { data } = await stravaApi.get(`/athletes/${athleteId}/stats`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  return data
}
