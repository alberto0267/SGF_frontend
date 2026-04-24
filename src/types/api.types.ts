export type UserRole = 'SuperAdmin' | 'Owner' | 'Manager' | 'Employee'

export interface User {
  uuid: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  companyUuid: string | null
  isActive: boolean
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}
