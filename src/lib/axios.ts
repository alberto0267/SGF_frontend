import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/auth.store'
import type { RefreshResponse } from '@/types/api.types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})

// ─── Request interceptor ──────────────────────────────────────────────────────
// Añade el Bearer token a cada request automáticamente
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Refresh token logic ──────────────────────────────────────────────────────
// Cuando hay varias requests en vuelo y el token expira al mismo tiempo,
// no queremos lanzar N refreshes. Usamos una cola para que solo se haga uno.
let isRefreshing = false

type QueueEntry = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

let failedQueue: QueueEntry[] = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token!)
  })
  failedQueue = []
}

// ─── Response interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Solo interceptamos 401 y solo una vez por request (_retry evita bucles)
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    // Cortocircuito para endpoints que no deben entrar en el ciclo de refresh.
    //
    // - /auth/refresh: si devuelve 401, el refreshToken también es inválido.
    //   Intentar refrescarlo causaría un deadlock: el interceptor encolaría la propia
    //   petición de refresh, que nunca se resolvería porque está esperándose a sí misma.
    //
    // - /auth/logout: si falla con 401, el token ya era inválido de todos modos.
    //   No hay nada que renovar — limpiamos sesión y redirigimos al login.
    const url = original.url ?? ''
    if (url.includes('/auth/refresh') || url.includes('/auth/logout')) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/'
      return Promise.reject(error)
    }

    // Si ya hay un refresh en curso, ponemos esta request en cola
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const refreshToken = useAuthStore.getState().refreshToken
      const { data } = await api.post<RefreshResponse>('/auth/refresh', {
        refreshToken,
      })
      useAuthStore.getState().setTokens(data.accessToken, refreshToken!)
      processQueue(null, data.accessToken)
      original.headers.Authorization = `Bearer ${data.accessToken}`
      return api(original)
    } catch (refreshError) {
      processQueue(refreshError, null)
      useAuthStore.getState().clearAuth()
      window.location.href = '/'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
