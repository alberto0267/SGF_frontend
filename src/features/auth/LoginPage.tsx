import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from './hooks/useLogin'

const schema = z.object({
  email: z.email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof schema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending, isError } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  })

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 40%, #3b1f6b 0%, #1e1145 40%, #0f0a2e 100%)',
      }}
    >
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl py-8 px-8">

        {/* Subtítulo */}
        <p className="text-center text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
          Sistema de Gestión de Franquicias
        </p>

        <h1 className="text-2xl font-bold text-gray-800 text-center">Bienvenido</h1>
        <p className="text-sm text-gray-500 text-center mt-1 mb-6">
          Inicia sesión para continuar con tu gestión
        </p>

        <form onSubmit={handleSubmit((data) => login(data))} className="space-y-4">

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm text-gray-700">
              Correo electrónico
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                autoComplete="email"
                className="pl-9"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm text-gray-700">
              Contraseña
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="pr-9"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-gray-700 hover:underline underline-offset-2"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {isError && (
            <p className="text-sm text-red-500 text-center">Credenciales incorrectas</p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-full h-11 mt-2"
          >
            {isPending ? 'Entrando...' : 'Entrar →'}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-xs text-purple-300/60 mt-6">
        SGFe © 2025 · Todos los derechos reservados
      </p>
    </div>
  )
}
