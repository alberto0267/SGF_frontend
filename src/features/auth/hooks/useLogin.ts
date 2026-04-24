import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '@/store/auth.store'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      setAuth(data.accessToken, data.refreshToken, data.user)
      navigate('/')
    },
  })
}
