/**
 * Instancia Axios centralizada — lista para backend.
 *
 * HOW TO USE:
 *   import api from '@/services/api'
 *   const data = await api.get('/patients')
 *   const data = await api.post('/patients', payload)
 */

import axios from 'axios'
import { sessionService } from '@/services/auth'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request: adjuntar token ────────────────────────────────
api.interceptors.request.use((config) => {
  const token = sessionService.get()?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response: normalizar errores ──────────────────────────
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const status  = err.response?.status
    const message = err.response?.data?.message ?? err.message ?? 'Error de red'

    // Token expirado → logout automático
    if (status === 401) {
      sessionService.clear()
      window.location.href = '/login'
    }

    return Promise.reject(new Error(message))
  }
)

export default api
