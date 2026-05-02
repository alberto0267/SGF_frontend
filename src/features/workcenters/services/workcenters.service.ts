import api from '@/lib/axios'

export interface ApiWorkcenter {
  uuid: string
  name: string
  address: string
  email: string | null
  active: 0 | 1
  created_at: string
  company: string
  company_uuid: string
  worker_count: number
}

interface WorkcentersResponse {
  data: ApiWorkcenter[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateWorkcenterPayload {
  companyUuid: string
  name: string
  address: string
  email?: string
}

export const workcentersService = {
  getAll:  () => api.get<WorkcentersResponse>('/workcenters').then((r) => r.data),
  create:  (payload: CreateWorkcenterPayload) => api.post('/workcenters/create-workcenters', payload),
}
