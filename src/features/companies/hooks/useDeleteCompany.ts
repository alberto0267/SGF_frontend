import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { companiesService } from '../services/companies.service'

export function useDeleteCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (uuid: string) => companiesService.deleteOne(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['companies'] })
      toast.success('Empresa eliminada correctamente')
    },
    onError: () => {
      toast.error('No se pudo eliminar la empresa')
    },
  })
}
