export type UserRole = 'SuperAdmin' | 'Owner' | 'Manager' | 'Employee'

export interface User {
  uuid: string
  email: string
  name: string
  role: UserRole
  companyName: string | null
  active: boolean
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
  expiresIn: number
}
