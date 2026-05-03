import api from '@/lib/axios'

export interface ApiCompany {
  uuid: string
  name: string
  nif: string
  address: string
  phone: string | null
  active: 0 | 1
  created_at: string
  user_count: number
  workcenter_count: number
}

interface CompaniesResponse {
  data: ApiCompany[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateCompanyPayload {
  name: string
  nif: string
  address: string
  phone: string
  owner: {
    firstName: string
    lastName: string
    dni: string
    email: string
    password: string
    phone: string
  }
  workCenters: {
    name: string
    address: string
    email?: string
  }[]
}

export interface ApiCompanySelect {
  uuid: string
  name: string
  nif: string
}

export const companiesService = {
  getAll:        () => api.get<CompaniesResponse>('/companies').then((r) => r.data),
  create:        (payload: CreateCompanyPayload) => api.post('/companies/create-company', payload),
  select:        (params?: { name?: string; nif?: string }) =>
    api.get<ApiCompanySelect[]>('/companies/select', { params }).then((r) => r.data),
  toggleActive:  (uuid: string, active: boolean) =>
    api.patch(`/companies/${uuid}/active`, { active }).then((r) => r.data),
}
