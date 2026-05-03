import { useMutation, useQueryClient } from '@tanstack/react-query'
import { companiesService } from '../services/companies.service'

export function useToggleCompanyActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ uuid, active }: { uuid: string; active: boolean }) =>
      companiesService.toggleActive(uuid, active),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }),
  })
}
