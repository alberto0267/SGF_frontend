import { QueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        const status = (error as AxiosError)?.response?.status
        if (status !== undefined && status >= 400 && status < 500) return false
        return failureCount < 2
      },
    },
  },
})
