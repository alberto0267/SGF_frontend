import { Link } from 'react-router-dom'
import { ChevronRight, Briefcase, UserCheck } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

const CARDS = [
  // { label: 'Gestión de Empleados',   desc: 'Ver, agregar y administrar empleados',      icon: Users,     color: '#7C3AED', to: '/empleados',      badge: undefined },
  // { label: 'Documentos y Registros', desc: 'Subir, consultar y firmar documentos',       icon: FileText,  color: '#0891B2', to: '/documentos',     badge: undefined },
  // { label: 'Calendario y Permisos',  desc: 'Ver turnos, solicitar permisos y ausencias', icon: Calendar,  color: '#1D4ED8', to: '/calendario',     badge: undefined },
  // { label: 'Notificaciones',         desc: 'Alertas, mensajes y avisos importantes',     icon: Bell,      color: '#D97706', to: '/notificaciones', badge: 2         },
  // { label: 'Franquicias',            desc: 'Gestión de franquicias y locales',           icon: Building2, color: '#059669', to: '/franquicias',    badge: undefined },
  // { label: 'Reportes',               desc: 'Análisis y estadísticas del sistema',        icon: BarChart2, color: '#DC2626', to: '/reportes',       badge: undefined },
  // { label: 'Permisos y Roles',       desc: 'Control de accesos y permisos',              icon: Shield,    color: '#9333EA', to: '/permisos',       badge: undefined },
  // { label: 'Configuración',          desc: 'Ajustes generales del sistema',              icon: Settings,  color: '#475569', to: '/configuracion',  badge: undefined },
  { label: 'Usuarios',               desc: 'Administración de cuentas de usuario',       icon: UserCheck, color: '#0F766E', to: '/usuarios',       badge: undefined },

  { label: 'Mensajes',              desc: 'Gestión de contratos laborales',             icon: Briefcase, color: '#B45309', to: '/contratos',      badge: undefined },
]

const DAY = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
const MONTH = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function today() {
  const d = new Date()
  return `${DAY[d.getDay()]}, ${d.getDate()} de ${MONTH[d.getMonth()]}`
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="bg-gray-100 flex-1 flex flex-col px-6 py-8 space-y-6">

      {/* Saludo */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Hola, <span style={{ color: '#7C3AED' }}>{user?.name}.</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Bienvenido al sistema de gestión — {today()}</p>
      </div>

      {/* Módulos */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Módulos del sistema</p>
        <ul className="grid grid-cols-2 gap-3 list-none p-0 m-0">
          {CARDS.map(({ label, desc, icon: Icon, color, badge, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 px-4 py-4 hover:shadow-md hover:border-gray-200 transition-all overflow-hidden relative"
              >
                {/* Barra de color izquierda */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: color }} />

                {/* Icono */}
                <div className="ml-2 flex-shrink-0" style={{ color }}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Texto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 text-sm">{label}</p>
                    {badge && (
                      <span className="bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                        {badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{desc}</p>
                </div>

                {/* Flecha */}
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Resumen rápido */}
      <div className="mt-auto bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="" className="w-5 h-5 object-contain" />
          <p className="font-semibold text-gray-800 text-sm">Resumen rápido</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-400 leading-tight">Usuarios activos hoy</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-xs text-gray-400 leading-tight">Documentos escaneados</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-400 leading-tight">Permisos esta semana</p>
          </div>
        </div>
      </div>

    </div>
  )
}
