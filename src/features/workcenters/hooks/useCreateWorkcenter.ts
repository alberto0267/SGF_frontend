import { useMutation, useQueryClient } from '@tanstack/react-query'
import { workcentersService } from '../services/workcenters.service'
import type { CreateWorkcenterPayload } from '../services/workcenters.service'

export function useCreateWorkcenter() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateWorkcenterPayload) => workcentersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workcenters'] })
    },
  })
}
