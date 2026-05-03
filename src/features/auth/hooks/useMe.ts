import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth.service'
import { useAuthStore } from '@/store/auth.store'

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setUser = useAuthStore((s) => s.setUser)

  const query = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.me().then((r) => r.data),
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (query.data) setUser(query.data)
  }, [query.data])

  return query
}
