import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '../services/users.service'
import type { UserRole } from '../services/users.service'

export function useChangeUserRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ uuid, role }: { uuid: string; role: UserRole }) =>
      usersService.changeRole(uuid, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Rol actualizado correctamente')
    },
    onError: () => {
      toast.error('No se pudo actualizar el rol')
    },
  })
}
