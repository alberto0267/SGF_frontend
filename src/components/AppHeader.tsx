import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useLogout } from '@/features/auth/hooks/useLogout'

export function AppHeader() {
  const user = useAuthStore((s) => s.user)
  const initials = user
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'
  const { mutate: logout, isPending } = useLogout()

  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
      style={{ background: 'linear-gradient(135deg, #11314E 0%, #1e1145 60%, #14093a 100%)' }}
    >
      <Link to="/dashboard">
        <img src="/logo.png" alt="SGF" className="w-16 h-16 object-contain" />
      </Link>

      <div className="flex items-center gap-3">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-8 h-8 rounded-full bg-slate-700 border border-white/20 flex items-center justify-center hover:bg-slate-600 transition-colors"
          >
            <span className="text-white text-xs font-bold">{initials}</span>
          </button>

          {open && (
            <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <button
                disabled
                title="Próximamente"
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 cursor-not-allowed"
              >
                <User className="w-4 h-4" />
                Datos
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => logout()}
                disabled={isPending}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <LogOut className="w-4 h-4" />
                {isPending ? 'Saliendo…' : 'Cerrar sesión'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
