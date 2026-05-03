import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { usersService } from '../services/users.service'
import type { UpdateUserPayload } from '../services/users.service'

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: UpdateUserPayload }) =>
      usersService.update(uuid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('Usuario actualizado correctamente')
    },
    onError: () => {
      toast.error('No se pudo actualizar el usuario')
    },
  })
}
