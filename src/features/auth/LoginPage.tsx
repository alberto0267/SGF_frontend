import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from './hooks/useLogin'
import { LoginBackground } from './components/LoginBackground'

const schema = z.object({
  email: z.email('Correo inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

type LoginFormData = z.infer<typeof schema>

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { mutate: login, isPending, loginError } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  })

  return (
    <div
      className="relative z-0 min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 gap-6"
      style={{
        background: 'linear-gradient(to bottom, #11314E 0%, #1e1145 55%, #14093a 100%)',
      }}
    >
      <LoginBackground />

      {/* Header: logo + subtítulo, fuera del card */}
      <div className="flex flex-col items-center gap-3">
        <img src="/logo.png" alt="SGF" className="w-[200px] h-[200px] drop-shadow-xl" />
        <p className="text-xs font-semibold tracking-widest text-white/50 uppercase">
          Sistema de Gestión de Franquicias
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl py-8 px-8">

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
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-xs text-red-500" role="alert">
                {errors.email.message}
              </p>
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
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-red-500" role="alert">
                {errors.password.message}
              </p>
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

          {loginError && (
            <p className="text-sm text-red-500 text-center" role="alert">
              {loginError}
            </p>
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
      <p className="text-xs text-purple-300/60">
        SGFe © 2025 · Todos los derechos reservados
      </p>
    </div>
  )
}
