import api from '@/lib/axios'
import type { LoginRequest, LoginResponse, User } from '@/types/api.types'

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data, {
      headers: { 'x-source': 'web' },
    }),

  logout: () =>
    api.post('/auth/logout', {}, { headers: { 'x-source': 'web' } }),

  me: () => api.get<User>('/auth/me'),
}
