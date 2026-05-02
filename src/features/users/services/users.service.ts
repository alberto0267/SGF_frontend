import api from '@/lib/axios'

export interface ApiUser {
  uuid: string
  email: string
  active: 0 | 1
  created_at: string
  role: string
  company: string
  first_name: string
  last_name: string
  dni: string | null
  phone: string
}

export const usersService = {
  getAll: () => api.get<ApiUser[]>('/users').then((r) => r.data),
}
