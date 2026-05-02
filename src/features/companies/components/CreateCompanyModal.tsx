import { X, Plus, Trash2 } from 'lucide-react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useCreateCompany } from '../hooks/useCreateCompany'

const schema = z.object({
  name:    z.string().min(1, 'Obligatorio'),
  nif:     z.string().min(1, 'Obligatorio'),
  address: z.string().min(1, 'Obligatorio'),
  phone:   z.string().min(1, 'Obligatorio'),
  owner: z.object({
    firstName: z.string().min(1, 'Obligatorio'),
    lastName:  z.string().min(1, 'Obligatorio'),
    dni:       z.string().min(1, 'Obligatorio'),
    email:     z.string().min(1, 'Obligatorio').email('Email inválido'),
    password:  z.string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe tener al menos un número')
      .regex(/[^A-Za-z0-9]/, 'Debe tener al menos un carácter especial'),
    phone: z.string().min(1, 'Obligatorio'),
  }),
  workCenters: z.array(z.object({
    name:    z.string().min(1, 'Obligatorio'),
    address: z.string().min(1, 'Obligatorio'),
    email:   z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
  })),
})

type FormData = z.infer<typeof schema>

interface Props {
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

export function CreateCompanyModal({ onClose }: Props) {
  const { mutate: createCompany, isPending } = useCreateCompany()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { workCenters: [] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'workCenters' })

  function onSubmit(data: FormData) {
    createCompany(
      {
        name:    data.name,
        nif:     data.nif,
        address: data.address,
        phone:   data.phone,
        owner:   data.owner,
        workCenters: data.workCenters.map((wc) => ({
          name:    wc.name,
          address: wc.address,
          ...(wc.email ? { email: wc.email } : {}),
        })),
      },
      {
        onSuccess: () => {
          toast.success('Compañía creada correctamente')
          onClose()
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message: string | string[] }>
          const msgs = axiosErr.response?.data?.message
          const text = msgs ? [msgs].flat().join(' · ') : 'Error al crear la compañía'
          toast.error(text)
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Nueva compañía</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form id="create-company-form" onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 px-6 py-5 space-y-6">

          {/* Datos empresa */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Datos de la empresa</h3>
            <div className="grid grid-cols-2 gap-3">
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
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Dirección</label>
                <input {...register('address')} className={inputClass(!!errors.address)} placeholder="Calle Mayor 1, Madrid" />
                <FieldError message={errors.address?.message} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Teléfono</label>
                <input {...register('phone')} className={inputClass(!!errors.phone)} placeholder="600000000" />
                <FieldError message={errors.phone?.message} />
              </div>
            </div>
          </section>

          {/* Datos owner */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Datos del propietario</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Nombre</label>
                <input {...register('owner.firstName')} className={inputClass(!!errors.owner?.firstName)} placeholder="Juan" />
                <FieldError message={errors.owner?.firstName?.message} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Apellidos</label>
                <input {...register('owner.lastName')} className={inputClass(!!errors.owner?.lastName)} placeholder="García" />
                <FieldError message={errors.owner?.lastName?.message} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">DNI</label>
                <input {...register('owner.dni')} className={inputClass(!!errors.owner?.dni)} placeholder="12345678A" />
                <FieldError message={errors.owner?.dni?.message} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Email</label>
                <input type="email" {...register('owner.email')} className={inputClass(!!errors.owner?.email)} placeholder="juan@empresa.com" />
                <FieldError message={errors.owner?.email?.message} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Contraseña</label>
                <input type="password" {...register('owner.password')} className={inputClass(!!errors.owner?.password)} placeholder="••••••••" />
                {errors.owner?.password
                  ? <FieldError message={errors.owner.password.message} />
                  : <p className="text-xs text-gray-400">Mínimo 8 caracteres, una mayúscula, un número y un carácter especial</p>
                }
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Teléfono</label>
                <input {...register('owner.phone')} className={inputClass(!!errors.owner?.phone)} placeholder="611000000" />
                <FieldError message={errors.owner?.phone?.message} />
              </div>
            </div>
          </section>

          {/* Centros de trabajo */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Centros de trabajo</h3>
              <button
                type="button"
                onClick={() => append({ name: '', address: '', email: '' })}
                className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir centro
              </button>
            </div>

            {fields.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-xl">
                Sin centros de trabajo. Puedes añadir uno opcional.
              </p>
            )}

            <div className="space-y-3">
              {fields.map((field, i) => (
                <div key={field.id} className="border border-gray-200 rounded-xl p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Centro {i + 1}</span>
                    <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">Nombre</label>
                      <input {...register(`workCenters.${i}.name`)} className={inputClass(!!errors.workCenters?.[i]?.name)} placeholder="Centro Principal" />
                      <FieldError message={errors.workCenters?.[i]?.name?.message} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">Email <span className="text-gray-400">(opcional)</span></label>
                      <input type="email" {...register(`workCenters.${i}.email`)} className={inputClass(!!errors.workCenters?.[i]?.email)} placeholder="centro@empresa.com" />
                      <FieldError message={errors.workCenters?.[i]?.email?.message} />
                    </div>
                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-600">Dirección</label>
                      <input {...register(`workCenters.${i}.address`)} className={inputClass(!!errors.workCenters?.[i]?.address)} placeholder="Calle Mayor 1, Madrid" />
                      <FieldError message={errors.workCenters?.[i]?.address?.message} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

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
            form="create-company-form"
            type="submit"
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Creando…' : 'Crear compañía'}
          </button>
        </div>

      </div>
    </div>
  )
}
