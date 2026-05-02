import { useState } from 'react'
import { X, Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useCompaniesSelect } from '@/features/companies/hooks/useCompaniesSelect'
import type { ApiCompanySelect } from '@/features/companies/services/companies.service'
import { useCreateWorkcenter } from '../hooks/useCreateWorkcenter'

const schema = z.object({
  companyUuid: z.string().min(1, 'Selecciona una compañía'),
  name:        z.string().min(1, 'Obligatorio'),
  address:     z.string().min(1, 'Obligatorio'),
  email:       z.union([z.string().email('Email inválido'), z.literal('')]).optional(),
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
    hasError ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'
  }`

export function CreateWorkcenterModal({ onClose }: Props) {
  const [search, setSearch] = useState('')
  const [selectedCompany, setSelectedCompany] = useState<ApiCompanySelect | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)

  const { data: companies, isLoading: loadingCompanies } = useCompaniesSelect(
    search.length > 0
      ? (search.match(/^[A-Za-z0-9]{1,2}[0-9]/) ? { nif: search } : { name: search })
      : {}
  )

  const { data: allCompanies } = useCompaniesSelect({})

  const { mutate: createWorkcenter, isPending } = useCreateWorkcenter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { companyUuid: '', name: '', address: '', email: '' },
  })

  function selectCompany(company: ApiCompanySelect) {
    setSelectedCompany(company)
    setValue('companyUuid', company.uuid, { shouldValidate: true })
    setSearch(`${company.name} — ${company.nif}`)
    setShowDropdown(false)
  }

  function onSubmit(data: FormData) {
    createWorkcenter(
      {
        companyUuid: data.companyUuid,
        name:        data.name,
        address:     data.address,
        ...(data.email ? { email: data.email } : {}),
      },
      {
        onSuccess: () => {
          toast.success('Centro de trabajo creado correctamente')
          onClose()
        },
        onError: (err) => {
          const axiosErr = err as AxiosError<{ message: string | string[] }>
          const msgs = axiosErr.response?.data?.message
          const text = msgs ? [msgs].flat().join(' · ') : 'Error al crear el centro de trabajo'
          toast.error(text)
        },
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Nuevo centro de trabajo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form id="create-workcenter-form" onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">

          {/* Buscador de compañía */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-medium text-gray-600">Compañía</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSelectedCompany(null)
                  setValue('companyUuid', '')
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                className={`${inputClass(!!errors.companyUuid)} pl-9`}
                placeholder="Buscar por nombre o NIF…"
                autoComplete="off"
              />
            </div>
            <input type="hidden" {...register('companyUuid')} />
            <FieldError message={errors.companyUuid?.message} />

            {/* Desplegable lista completa */}
            <select
              onChange={(e) => {
                const company = allCompanies?.find((c) => c.uuid === e.target.value)
                if (company) selectCompany(company)
              }}
              defaultValue=""
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-500"
            >
              <option value="" disabled>O elige de la lista…</option>
              {allCompanies?.map((c) => (
                <option key={c.uuid} value={c.uuid}>{c.name} — {c.nif}</option>
              ))}
            </select>

            {showDropdown && search.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                {loadingCompanies && (
                  <p className="text-xs text-gray-400 text-center py-3">Buscando…</p>
                )}
                {!loadingCompanies && companies?.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-3">Sin resultados</p>
                )}
                {companies?.map((c) => (
                  <button
                    key={c.uuid}
                    type="button"
                    onMouseDown={() => selectCompany(c)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{c.name}</span>
                    <span className="text-gray-400 ml-2 text-xs">{c.nif}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Nombre</label>
            <input {...register('name')} className={inputClass(!!errors.name)} placeholder="Centro Norte" />
            <FieldError message={errors.name?.message} />
          </div>

          {/* Dirección */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Dirección</label>
            <input {...register('address')} className={inputClass(!!errors.address)} placeholder="Calle Mayor 1, Madrid" />
            <FieldError message={errors.address?.message} />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-600">Email <span className="text-gray-400">(opcional)</span></label>
            <input type="email" {...register('email')} className={inputClass(!!errors.email)} placeholder="centro@empresa.com" />
            <FieldError message={errors.email?.message} />
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
            form="create-workcenter-form"
            type="submit"
            disabled={isPending || !selectedCompany}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Creando…' : 'Crear centro'}
          </button>
        </div>

      </div>
    </div>
  )
}
