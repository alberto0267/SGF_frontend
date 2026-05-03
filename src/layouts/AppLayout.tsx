import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'
import { useMe } from '@/features/auth/hooks/useMe'

export function AppLayout() {
  useMe()

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-auto flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
