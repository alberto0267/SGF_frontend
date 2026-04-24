# SGF Frontend — Guía de aprendizaje React

> Escrita para alguien que viene de Vue 3. Cada decisión está explicada con el "por qué".

---

## Cómo arrancar el proyecto

```bash
cd AppDiaIa/frontend
npm run dev        # arranca en localhost:5173
npm run build      # build de producción
npx tsc --noEmit   # solo chequeo de tipos
```

El backend tiene que estar corriendo en `:3000` para que las llamadas API funcionen:
```bash
# en AppDiaIa/backend
pnpm nx serve @org/api
```

---

## Stack elegido y por qué

| Herramienta | Equivalente Vue | Por qué esta y no otra |
|-------------|-----------------|------------------------|
| **Vite** | Vite | Mismo. Estándar de industria. |
| **React 19** | Vue 3 | Target del aprendizaje |
| **TypeScript** | TypeScript | Mismo. Siempre strict. |
| **React Router v7** | Vue Router | El router más usado en React, docs excelentes |
| **TanStack Query v5** | (no hay equiv directo) | Maneja server state: loading, cache, refetch, errores. Sin él usarías `useEffect` + `useState` para cada llamada API — un desastre |
| **Zustand** | Pinia | Store de cliente (tokens, user). 1KB, sin boilerplate, sin Provider |
| **Axios** | Axios | Mismo. Interceptores para JWT |
| **React Hook Form + Zod** | VeeValidate + Zod | Forms con validación tipada |
| **Shadcn/ui** | — | Componentes que viven en TU código, no en node_modules |
| **Tailwind CSS v4** | — | CSS utility-first, el más demandado en el mercado |

---

## Estructura de carpetas

```
src/
├── components/
│   └── ui/              ← Componentes de Shadcn (son TUYOS, puedes editarlos)
│       ├── button.tsx
│       ├── input.tsx
│       └── label.tsx
│
├── features/            ← Un módulo por dominio de negocio
│   ├── auth/
│   │   ├── components/  ← Solo presentación (LoginForm)
│   │   ├── hooks/       ← Lógica con TanStack Query (useLogin)
│   │   ├── services/    ← Solo llamadas HTTP (authService)
│   │   └── LoginPage.tsx
│   └── dashboard/
│       └── DashboardPage.tsx
│
├── layouts/
│   └── AppLayout.tsx    ← Sidebar + Outlet (estructura de página)
│
├── lib/
│   ├── axios.ts         ← Instancia HTTP configurada + interceptores JWT ⭐
│   ├── query-client.ts  ← Config global de TanStack Query
│   └── utils.ts         ← cn() helper de Shadcn (combina clases Tailwind)
│
├── router/
│   ├── index.tsx        ← Árbol de rutas
│   └── ProtectedRoute.tsx ← Guard: si no estás autenticado → /login
│
├── store/
│   └── auth.store.ts    ← Zustand: tokens, user, isAuthenticated ⭐
│
├── types/
│   └── api.types.ts     ← Tipos TypeScript de la API (User, LoginResponse…)
│
├── index.css            ← Tailwind + variables de color de Shadcn
└── main.tsx             ← Punto de entrada, monta los providers
```

### La regla de capas (igual que el backend)

```
services/  →  solo llamadas HTTP        (como Repository en NestJS)
hooks/     →  lógica + TanStack Query   (como Service en NestJS)
components/→  solo presentación         (como Controller, pero visual)
store/     →  estado del cliente        (tokens, UI state)
```

**Nunca** pongas una llamada `axios.get(...)` directamente en un componente.
**Siempre** va en `services/` y se consume desde un hook.

---

## Los dos archivos más importantes

### `src/lib/axios.ts` — El corazón del plumbing HTTP

Este archivo hace tres cosas:

**1. Crea la instancia base de Axios**
```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
})
```
En lugar de `axios.get('http://localhost:3000/api/users')` en cada sitio,
usas `api.get('/users')` y la baseURL se añade automáticamente.

**2. Request interceptor — añade el token automáticamente**
```ts
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```
Equivale a hacer `Authorization: Bearer xxx` en cada request, pero sin tener
que escribirlo en cada llamada. El interceptor lo hace solo.

> 💡 `useAuthStore.getState()` — fuera de un componente React no puedes usar hooks
> (los hooks solo funcionan dentro de componentes/otros hooks). Zustand tiene
> `.getState()` para acceder al store desde cualquier sitio.

**3. Response interceptor — refresh token automático**

Este es el más complejo pero el más valioso de entender:

```
Request falla con 401 (token expirado)
    ↓
¿Ya está haciendo refresh? → sí → ponemos la request en cola
    ↓ no
Llamamos a POST /auth/refresh con el refreshToken
    ↓
Guardamos los nuevos tokens en el store
    ↓
Reintentamos TODAS las requests que estaban en cola con el nuevo token
    ↓
Si el refresh también falla → logout + redirect /login
```

Sin esto, el usuario vería un error 401 cada vez que su token expira (cada 15-60 min).
Con esto, el token se renueva de forma invisible.

---

### `src/store/auth.store.ts` — Estado global de autenticación

```ts
// Vue (Pinia)
export const useAuthStore = defineStore('auth', {
  state: () => ({ accessToken: null, user: null }),
  actions: {
    setAuth(token, user) { this.accessToken = token; this.user = user }
  }
})

// React (Zustand) — prácticamente igual
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (token, user) => set({ accessToken: token, user }),
    }),
    { name: 'sgf-auth' }  // ← persiste en localStorage con esta key
  )
)
```

`persist` es middleware de Zustand — guarda el estado en `localStorage`
automáticamente. Si el usuario recarga la página, sigue autenticado.

**Cómo usarlo en un componente:**
```tsx
// Solo te suscribes a lo que necesitas (optimización de re-renders)
const user = useAuthStore((s) => s.user)
const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
```

---

## Routing: rutas protegidas

```tsx
// src/router/index.tsx
createBrowserRouter([
  { path: '/login', element: <LoginPage /> },         // pública
  {
    element: <ProtectedRoute />,                       // guard
    children: [
      {
        element: <AppLayout />,                        // layout con sidebar
        children: [
          { path: '/', element: <DashboardPage /> },  // protegida
        ],
      },
    ],
  },
])
```

`ProtectedRoute` lee `isAuthenticated` del store. Si es `false`, redirige a `/login`.
Es el equivalente a los navigation guards de Vue Router (`router.beforeEach`).

---

## TanStack Query — server state

En Vue sin React Query harías:
```ts
// ❌ el patrón "manual" que NO queremos
const users = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(async () => {
  loading.value = true
  try {
    users.value = await fetchUsers()
  } catch(e) {
    error.value = e
  } finally {
    loading.value = false
  }
})
```

Con TanStack Query:
```ts
// ✅ esto hace lo mismo + cache + refetch + deduplication
const { data: users, isLoading, isError } = useQuery({
  queryKey: ['users'],
  queryFn: () => usersService.getAll(),
})
```

`queryKey` es importante: es la "clave de caché". Si dos componentes piden
`['users']`, TanStack Query hace **una sola** petición HTTP.

---

## Mutations — escribir datos

```ts
// Para operaciones que modifican datos (POST, PATCH, DELETE)
const { mutate: login, isPending, isError } = useMutation({
  mutationFn: authService.login,          // la función que llama a la API
  onSuccess: ({ data }) => {              // callback cuando va bien
    setAuth(data.accessToken, data.refreshToken, data.user)
    navigate('/')
  },
})

// En el form:
<form onSubmit={handleSubmit((data) => login(data))}>
```

---

## React Hook Form + Zod

```ts
const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof schema>  // TypeScript infiere el tipo del schema
```

`z.infer<typeof schema>` es la magia: el tipo TypeScript **se genera** del schema
de validación. No hay que definir el tipo por separado — si cambias el schema,
el tipo cambia automáticamente.

---

## Shadcn/ui — componentes que son tuyos

Cuando ejecutas:
```bash
npx shadcn add button
```

Crea `src/components/ui/button.tsx` en **tu proyecto**. No viene de `node_modules`.
Puedes abrirlo, editarlo, cambiar clases, añadir variantes. Eso es lo que
diferencia a Shadcn de Ant Design.

```tsx
// src/components/ui/button.tsx — es tuyo, cámbialo como quieras
export function Button({ className, variant, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  )
}
```

---

## Tailwind CSS — utilidades en lugar de clases custom

```tsx
// Sin Tailwind
<div className="login-card">  {/* tienes que ir al CSS a ver qué hace */}

// Con Tailwind
<div className="rounded-xl border bg-card p-8 shadow-lg">
  {/* lees directamente qué estilos tiene */}
```

Las clases de color (`bg-card`, `text-muted-foreground`, etc.) son variables
CSS que Shadcn define en `index.css`. Se adaptan automáticamente al dark/light mode.

---

## Próximos pasos (features a construir)

- [ ] **Logout** — botón en sidebar que llama `authService.logout()` y limpia el store
- [ ] **Dashboard** — cards con stats (empleados, documentos, permisos)
- [ ] **Users** — tabla con CRUD completo, formulario con React Hook Form
- [ ] **Permissions** — tabla con tabs (próximos 7/15/30 días)
- [ ] **Sales chart** — gráfica de ventas con Recharts
- [ ] **Error handling global** — toast notifications con Shadcn Sonner
