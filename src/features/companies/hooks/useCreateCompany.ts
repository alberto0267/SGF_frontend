import { useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesService } from '../services/companies.service'
import type { CreateCompanyPayload } from '../services/companies.service'

export function useCreateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCompanyPayload) => companiesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
    },
  })
}
