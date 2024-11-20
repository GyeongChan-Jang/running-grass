import axios from 'axios'

export const getToken = async () => {
  try {
    const { data } = await axios.get('/api/user')
    return data
  } catch (error) {
    console.error('Failed to get token:', error)
    return null
  }
}
