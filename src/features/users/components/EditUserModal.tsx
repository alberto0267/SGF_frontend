import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useUpdateUser } from '../hooks/useUpdateUser'
import type { ApiUser } from '../services/users.service'

const schema = z.object({
  email:     z.union([z.string().email('Email inválido'), z.literal('')]),
  firstName: z.string(),
  lastName:  z.string(),
  dni:       z.string(),
  phone:     z.string(),
  address:   z.string(),
})

type FormData = z.infer<typeof schema>

interface Props {
  user: ApiUser
  onClose: () => void
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500 mt-0.5">{message}</p>
}

const inputClass = (hasError: boolean) =>
  `border rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:ring-red-400'
      : 'border-gray-200 focus:ring-indigo-500'
  }`

export function EditUserModal({ user, onClose }: Props) {
  const { mutate: updateUser, isPending } = useUpdateUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email:     user.email,
      firstName: user.first_name,
      lastName:  user.last_name,
      dni:       user.dni ?? '',
      phone:     user.phone ?? '',
      address:   '',
    },
  })

  function onSubmit(data: FormData) {
    // Solo envía los campos que tienen valor
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '')
    ) as Record<string, string>

    updateUser(
      { uuid: user.uuid, payload },
      {
        onSuccess: () => onClose(),
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message: string | string[] }>
          const msgs = axiosErr.response?.data?.message
          const text = msgs ? [msgs].flat().join(' · ') : 'Error al actualizar el usuario'
          toast.error(text)
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Editar usuario</h2>
            <p className="text-xs text-gray-400 mt-0.5">Solo se envían los campos que modifiques</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 grid grid-cols-2 gap-3">
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Email</label>
            <input type="email" {...register('email')} className={inputClass(!!errors.email)} />
            <FieldError message={errors.email?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Nombre</label>
            <input {...register('firstName')} className={inputClass(!!errors.firstName)} />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Apellidos</label>
            <input {...register('lastName')} className={inputClass(!!errors.lastName)} />
            <FieldError message={errors.lastName?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">DNI</label>
            <input {...register('dni')} className={inputClass(!!errors.dni)} placeholder="12345678A" />
            <FieldError message={errors.dni?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Teléfono</label>
            <input {...register('phone')} className={inputClass(!!errors.phone)} placeholder="600000000" />
            <FieldError message={errors.phone?.message} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Dirección</label>
            <input {...register('address')} className={inputClass(!!errors.address)} placeholder="Calle Mayor 1, Madrid" />
            <FieldError message={errors.address?.message} />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            form="edit-user-form"
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </div>

      </div>
    </div>
  )
}
