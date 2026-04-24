import { useAuthStore } from '@/store/auth.store'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">
        Hola, {user?.firstName} {user?.lastName}
      </h1>
      <p className="text-muted-foreground mt-1">Bienvenido al sistema de gestión</p>
    </div>
  )
}
