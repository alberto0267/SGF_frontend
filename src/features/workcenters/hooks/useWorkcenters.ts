import { useQuery } from '@tanstack/react-query'
import { workcentersService } from '../services/workcenters.service'

export function useWorkcenters() {
  return useQuery({
    queryKey: ['workcenters'],
    queryFn: workcentersService.getAll,
    staleTime: 0,
  })
}
