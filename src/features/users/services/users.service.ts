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

export interface UpdateUserPayload {
  email?:       string
  firstName?:   string
  lastName?:    string
  dni?:         string
  phone?:       string
  address?:     string
  newPassword?: string
}

export type UserRole = 'Owner' | 'Manager' | 'Employee'

export const usersService = {
  getAll:     () => api.get<ApiUser[]>('/users').then((r) => r.data),
  update:     (uuid: string, payload: UpdateUserPayload) =>
    api.patch(`/users/${uuid}`, payload).then((r) => r.data),
  changeRole: (uuid: string, role: UserRole) =>
    api.patch(`/users/${uuid}/role`, { role }).then((r) => r.data),
  deleteOne:  (uuid: string) =>
    api.delete(`/users/${uuid}`).then((r) => r.data),
}
