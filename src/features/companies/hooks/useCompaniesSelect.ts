import { useQuery } from '@tanstack/react-query'
import { companiesService } from '../services/companies.service'

interface Filters {
  name?: string
  nif?: string
}

export function useCompaniesSelect(filters: Filters) {
  return useQuery({
    queryKey: ['companies-select', filters],
    queryFn: () => companiesService.select(filters),
  })
}
