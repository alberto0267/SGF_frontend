import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Dashboard' },
]

export function AppLayout() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 border-r bg-sidebar flex flex-col shrink-0">
        <div className="h-14 flex items-center px-5 border-b">
          <span className="font-bold text-lg text-sidebar-foreground">SGF</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t text-sm text-sidebar-foreground">
          <p className="font-medium">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
