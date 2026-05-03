import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '../services/users.service'

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (uuid: string) => usersService.deleteOne(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario eliminado correctamente')
    },
    onError: () => {
      toast.error('No se pudo eliminar el usuario')
    },
  })
}
