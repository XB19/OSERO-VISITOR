import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
})

const AUTH_STORAGE_KEY = 'osero_visitor_auth'

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (raw) {
    const auth = JSON.parse(raw)
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

export { AUTH_STORAGE_KEY }
