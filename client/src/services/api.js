// src/services/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://carbon-footprint-i1co.onrender.com/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Attach JWT ──────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eg_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (err) => Promise.reject(err)
)

// ── Handle 401 ──────────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('eg_token')
      const isAuthRequest = err.config?.url?.includes('/auth/login') || err.config?.url?.includes('/auth/register')
      const isPublicPage = ['/', '/login', '/register'].includes(window.location.pathname)
      if (!isAuthRequest && !isPublicPage) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
