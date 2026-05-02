import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/AppHeader'

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
