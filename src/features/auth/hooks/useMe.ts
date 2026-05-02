import { useQuery } from '@tanstack/react-query'
import { authService } from '../services/auth.service'
import { useAuthStore } from '@/store/auth.store'

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: ['me'],
    queryFn: () => authService.me().then((r) => r.data),
    enabled: isAuthenticated,
  })
}
