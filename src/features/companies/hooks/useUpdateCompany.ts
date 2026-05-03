import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { companiesService } from '../services/companies.service'
import type { UpdateCompanyPayload } from '../services/companies.service'

export function useUpdateCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateCompanyPayload }) =>
      companiesService.update(uuid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Empresa actualizada correctamente')
    },
    onError: () => {
      toast.error('No se pudo actualizar la empresa')
    },
  })
}
