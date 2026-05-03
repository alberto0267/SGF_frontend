import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useUpdateCompany } from '../hooks/useUpdateCompany'
import type { ApiCompany } from '../services/companies.service'

const schema = z.object({
  name:    z.string().min(1, 'Obligatorio'),
  nif:     z.string().min(1, 'Obligatorio'),
  address: z.string().min(1, 'Obligatorio'),
  phone:   z.string().min(1, 'Obligatorio'),
})

type FormData = z.infer<typeof schema>

interface Props {
  company: ApiCompany
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

export function EditCompanyModal({ company, onClose }: Props) {
  const { mutate: updateCompany, isPending } = useUpdateCompany()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name:    company.name,
      nif:     company.nif,
      address: company.address,
      phone:   company.phone ?? '',
    },
  })

  function onSubmit(data: FormData) {
    updateCompany(
      { uuid: company.uuid, payload: data },
      {
        onSuccess: () => onClose(),
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message: string | string[] }>
          const msgs = axiosErr.response?.data?.message
          const text = msgs ? [msgs].flat().join(' · ') : 'Error al actualizar la compañía'
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
          <h2 className="text-lg font-semibold text-gray-900">Editar empresa</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form id="edit-company-form" onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Nombre</label>
            <input {...register('name')} className={inputClass(!!errors.name)} placeholder="Empresa S.L." />
            <FieldError message={errors.name?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">NIF</label>
            <input {...register('nif')} className={inputClass(!!errors.nif)} placeholder="B12345678" />
            <FieldError message={errors.nif?.message} />
          </div>
          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-xs font-medium text-gray-600">Dirección</label>
            <input {...register('address')} className={inputClass(!!errors.address)} placeholder="Calle Mayor 1, Madrid" />
            <FieldError message={errors.address?.message} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Teléfono</label>
            <input {...register('phone')} className={inputClass(!!errors.phone)} placeholder="600000000" />
            <FieldError message={errors.phone?.message} />
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
            form="edit-company-form"
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
