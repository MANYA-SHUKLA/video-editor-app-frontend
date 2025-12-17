export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || ''

export const getApiUrl = (endpoint: string): string => {
  return API_BASE ? `${API_BASE}${endpoint}` : endpoint
}