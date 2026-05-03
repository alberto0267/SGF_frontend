import { useState } from 'react'
import { UserCog, Plus, FileUp } from 'lucide-react'
import { CreateCompanyModal } from '@/features/companies/components/CreateCompanyModal'
import { CreateWorkcenterModal } from '@/features/workcenters/components/CreateWorkcenterModal'
import { useUsers } from './hooks/useUsers'
import type { ApiUser } from './services/users.service'
import { useCompanies } from '@/features/companies/hooks/useCompanies'
import { useToggleCompanyActive } from '@/features/companies/hooks/useToggleCompanyActive'
import type { ApiCompany } from '@/features/companies/services/companies.service'
import { useWorkcenters } from '@/features/workcenters/hooks/useWorkcenters'
import type { ApiWorkcenter } from '@/features/workcenters/services/workcenters.service'

type Tab = 'usuarios' | 'companies' | 'workcenters'

// ── Helpers ───────────────────────────────────────────────────────────────────
const ROLE_BADGE: Record<string, string> = {
  SuperAdmin: 'bg-purple-100 text-purple-700',
  Owner:      'bg-blue-100 text-blue-700',
  Manager:    'bg-cyan-100 text-cyan-700',
  Employee:   'bg-gray-100 text-gray-600',
}

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_BADGE[role] ?? 'bg-gray-100 text-gray-600'}`}>
      {role}
    </span>
  )
}

function StatusBadge({ active }: { active: 0 | 1 }) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

function ImpersonateButton({ user }: { user: ApiUser }) {
  const isSuperAdmin = user.role === 'SuperAdmin'
  return (
    <button
      disabled={isSuperAdmin}
      title={isSuperAdmin ? 'No se puede impersonar a un SuperAdmin' : `Impersonar a ${user.first_name}`}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
        disabled:opacity-30 disabled:cursor-not-allowed
        enabled:bg-indigo-50 enabled:text-indigo-700 enabled:hover:bg-indigo-100 enabled:cursor-pointer"
    >
      <UserCog className="w-3.5 h-3.5" />
      Impersonar
    </button>
  )
}

// ── Tabla Usuarios ────────────────────────────────────────────────────────────
function UsersTable() {
  const { data: users, isLoading, isError } = useUsers()

  if (isLoading) return <p className="text-gray-400 text-sm text-center py-12">Cargando usuarios…</p>
  if (isError)   return <p className="text-red-500 text-sm text-center py-12">Error al cargar los usuarios.</p>

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 font-medium uppercase tracking-wide">
          <th className="px-4 py-3">Nombre</th>
          <th className="px-4 py-3">Email</th>
          <th className="px-4 py-3">DNI</th>
          <th className="px-4 py-3">Teléfono</th>
          <th className="px-4 py-3">Rol</th>
          <th className="px-4 py-3">Empresa</th>
          <th className="px-4 py-3">Estado</th>
          <th className="px-4 py-3">Impersonación</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user.uuid} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
              {user.first_name} {user.last_name}
            </td>
            <td className="px-4 py-3 text-gray-500">{user.email}</td>
            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{user.dni ?? '—'}</td>
            <td className="px-4 py-3 text-gray-500">{user.phone}</td>
            <td className="px-4 py-3"><RoleBadge role={user.role} /></td>
            <td className="px-4 py-3 text-gray-500">{user.company}</td>
            <td className="px-4 py-3"><StatusBadge active={user.active} /></td>
            <td className="px-4 py-3"><ImpersonateButton user={user} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Tabla Companies ───────────────────────────────────────────────────────────
function CompaniesTable() {
  const { data, isLoading, isError } = useCompanies()
  const { mutate: toggleActive, isPending } = useToggleCompanyActive()

  if (isLoading) return <p className="text-gray-400 text-sm text-center py-12">Cargando empresas…</p>
  if (isError)   return <p className="text-red-500 text-sm text-center py-12">Error al cargar las empresas.</p>

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 font-medium uppercase tracking-wide">
          <th className="px-4 py-3">Nombre</th>
          <th className="px-4 py-3">NIF</th>
          <th className="px-4 py-3">Dirección</th>
          <th className="px-4 py-3">Teléfono</th>
          <th className="px-4 py-3">Usuarios</th>
          <th className="px-4 py-3">Centros</th>
          <th className="px-4 py-3">Estado</th>
          <th className="px-4 py-3">Alta</th>
        </tr>
      </thead>
      <tbody>
        {data?.data.map((company: ApiCompany) => (
          <tr key={company.uuid} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 font-medium text-gray-900">{company.name}</td>
            <td className="px-4 py-3 text-gray-500 font-mono text-xs">{company.nif}</td>
            <td className="px-4 py-3 text-gray-500">{company.address}</td>
            <td className="px-4 py-3 text-gray-500">{company.phone ?? '—'}</td>
            <td className="px-4 py-3 text-gray-500 text-center">{company.user_count}</td>
            <td className="px-4 py-3 text-gray-500 text-center">{company.workcenter_count}</td>
            <td className="px-4 py-3">
              <button
                disabled={isPending}
                onClick={() => toggleActive({ uuid: company.uuid, active: company.active === 0 })}
                className={`relative inline-flex w-10 h-6 rounded-full transition-colors disabled:opacity-50 cursor-pointer ${
                  company.active ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  company.active ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </td>
            <td className="px-4 py-3 text-gray-400 text-xs">
              {new Date(company.created_at).toLocaleDateString('es-ES')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Tabla Workcenters ─────────────────────────────────────────────────────────
function WorkcentersTable() {
  const { data, isLoading, isError } = useWorkcenters()

  if (isLoading) return <p className="text-gray-400 text-sm text-center py-12">Cargando centros de trabajo…</p>
  if (isError)   return <p className="text-red-500 text-sm text-center py-12">Error al cargar los centros de trabajo.</p>

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100 text-left text-xs text-gray-400 font-medium uppercase tracking-wide">
          <th className="px-4 py-3">Nombre</th>
          <th className="px-4 py-3">Dirección</th>
          <th className="px-4 py-3">Email</th>
          <th className="px-4 py-3">Empresa</th>
          <th className="px-4 py-3">Trabajadores</th>
          <th className="px-4 py-3">Estado</th>
          <th className="px-4 py-3">Alta</th>
        </tr>
      </thead>
      <tbody>
        {data?.data.map((wc: ApiWorkcenter) => (
          <tr key={wc.uuid} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 font-medium text-gray-900">{wc.name}</td>
            <td className="px-4 py-3 text-gray-500">{wc.address}</td>
            <td className="px-4 py-3 text-gray-500">{wc.email}</td>
            <td className="px-4 py-3 text-gray-500">{wc.company}</td>
            <td className="px-4 py-3 text-gray-500 text-center">{wc.worker_count}</td>
            <td className="px-4 py-3"><StatusBadge active={wc.active} /></td>
            <td className="px-4 py-3 text-gray-400 text-xs">
              {new Date(wc.created_at).toLocaleDateString('es-ES')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; addLabel: string }[] = [
  { id: 'usuarios',    label: 'Usuarios',           addLabel: 'Agregar usuario'          },
  { id: 'companies',   label: 'Compañías',          addLabel: 'Agregar compañía'         },
  { id: 'workcenters', label: 'Centros de trabajo', addLabel: 'Agregar centro de trabajo'},
]

export function UsersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('usuarios')
  const [showCreateCompany, setShowCreateCompany] = useState(false)
  const [showCreateWorkcenter, setShowCreateWorkcenter] = useState(false)
  const currentTab = TABS.find((t) => t.id === activeTab)!

  function handleAddClick() {
    if (activeTab === 'companies')   setShowCreateCompany(true)
    if (activeTab === 'workcenters') setShowCreateWorkcenter(true)
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Datos</h1>
        <p className="text-gray-500 text-sm mb-6">Gestión de datos del sistema</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 bg-gray-300 p-1 rounded-xl w-fit">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button onClick={handleAddClick} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" />
              {currentTab.addLabel}
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <FileUp className="w-4 h-4" />
              Agregar CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            {activeTab === 'usuarios'    && <UsersTable />}
            {activeTab === 'companies'   && <CompaniesTable />}
            {activeTab === 'workcenters' && <WorkcentersTable />}
          </div>
        </div>
      </div>

      {showCreateCompany    && <CreateCompanyModal    onClose={() => setShowCreateCompany(false)} />}
      {showCreateWorkcenter && <CreateWorkcenterModal onClose={() => setShowCreateWorkcenter(false)} />}
    </div>
  )
}
