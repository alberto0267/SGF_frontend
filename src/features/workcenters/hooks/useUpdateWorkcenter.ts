import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { workcentersService } from '../services/workcenters.service'
import type { UpdateWorkcenterPayload } from '../services/workcenters.service'

export function useUpdateWorkcenter() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateWorkcenterPayload }) =>
      workcentersService.update(uuid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workcenters'] })
      toast.success('Centro de trabajo actualizado correctamente')
    },
    onError: () => {
      toast.error('No se pudo actualizar el centro de trabajo')
    },
  })
}
