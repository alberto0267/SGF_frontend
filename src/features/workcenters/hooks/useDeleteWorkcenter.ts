import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workcentersService } from '../services/workcenters.service'

export function useDeleteWorkcenter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (uuid: string) => workcentersService.deleteOne(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workcenters'] })
      toast.success('Centro de trabajo eliminado correctamente')
    },
    onError: () => {
      toast.error('No se pudo eliminar el centro de trabajo')
    },
  })
}
