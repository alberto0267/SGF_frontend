import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import type { AxiosError } from 'axios'
import { authService } from '../services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import type { LoginRequest, LoginResponse } from '@/types/api.types'
import type { AxiosResponse } from 'axios'

type BackendError = { code: string; message: string }

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const mutation = useMutation<AxiosResponse<LoginResponse>, AxiosError<BackendError>, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      setAuth(data.accessToken, data.refreshToken, data.user)
      navigate('/')
    },
  })

  return {
    ...mutation,
    loginError: mutation.error
      ? (mutation.error.response?.data?.message ?? 'Ocurrió un error inesperado.')
      : null,
  }
}
