# Cómo se conectan las capas

## La regla de oro

Cada capa tiene una sola responsabilidad. Ninguna capa habla con una que no le toca.

```
Página → Hook → Service → axios.ts → Backend
```

---

## Las capas y qué hace cada una

### `lib/axios.ts` — el cliente HTTP configurado (se toca una sola vez)

Es un fetch preconfigurado. Se crea una instancia con la URL base y dos interceptors:

- **Request interceptor**: antes de CADA request, lee el token del store y lo pone en el header `Authorization`. Automático, sin que nadie lo pida.
- **Response interceptor**: si cualquier response es 401 (token expirado), renueva el token silenciosamente y reintenta la request original. El hook ni se entera.

```
api.post('/auth/login', data)
    ↓ [interceptor de request]
    añade Bearer token
    ↓
    fetch real al backend
    ↓ [interceptor de response]
    200 → pasa la respuesta
    401 → renueva token, reintenta
    otro error → lo propaga al service
```

**No se toca cuando añades nuevos endpoints.** Los interceptors se disparan solos en todo GET, POST, DELETE, etc.

---

### `services/*.service.ts` — los contratos con el backend

Solo define qué endpoints existen y cómo se llaman. Usa `api` (la instancia de axios.ts), no fetch ni axios directo.

```ts
export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  logout: ()                  => api.post('/auth/logout'),
  me: ()                      => api.get<User>('/auth/me'),
}
```

No tiene lógica. No sabe si hay un usuario, un store ni una pantalla. Solo sabe: "este endpoint existe, recibe esto, devuelve esto".

Si mañana cambia una URL, la cambias aquí. En un solo lugar.

---

### `hooks/use*.ts` — la lógica del caso de uso

Aquí vive TODO lo que piensa la app en el cliente:
- Llama al service para hacer el HTTP
- Si funciona → guarda en el store, navega, etc.
- Si falla → extrae el mensaje del backend y lo expone listo para pintar

Para **acciones** (crear, login, borrar) → `useMutation`
Para **leer datos** → `useQuery`

```ts
// Acción (POST, login, etc.)
export function useLogin() {
  const mutation = useMutation({
    mutationFn: authService.login,       // delega el HTTP
    onSuccess: ({ data }) => {
      setAuth(...)                        // guarda en store
      navigate('/')                       // navega
    },
  })
  return {
    ...mutation,
    loginError: mutation.error?.response?.data?.message ?? null,
  }
}

// Lectura (GET)
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
  })
}
```

El hook **no sabe que existe un botón ni un input**. Solo expone estado y funciones.

---

### `store/*.store.ts` — el estado global

Solo guarda datos que necesitan vivir entre navegaciones: sesión, tokens, usuario autenticado.

El hook escribe en el store. La página puede leer del store directamente si solo necesita datos (sin lógica).

**No se usa para guardar cualquier cosa.** Si un dato solo lo usa una pantalla, va en estado local con `useState`.

---

### `pages/*.tsx` — solo pinta y reacciona

No sabe de HTTP, tokens ni stores (salvo leer datos simples). Solo sabe:
- Llamar a funciones del hook cuando el usuario actúa
- Pintar lo que el hook expone (`isLoading`, `data`, `error`)

```tsx
const { mutate: login, isPending, loginError } = useLogin()

<form onSubmit={handleSubmit((data) => login(data))}>
  {loginError && <p>{loginError}</p>}
  <Button disabled={isPending}>Entrar</Button>
</form>
```

---

## Flujo completo — un login de principio a fin

```
1. Usuario escribe email y contraseña y presiona "Entrar"

2. LoginPage → handleSubmit → login(data)
   La página no sabe qué pasa después. Solo llama a la función.

3. useLogin → useMutation → authService.login(data)
   El hook orquesta: llama al service con los datos.

4. authService → api.post('/auth/login', data)
   El service construye la request y la pasa a axios.

5. axios.ts interceptor de REQUEST
   Lee el token del store (null en login) → no añade nada → envía.

6. Backend procesa → responde 200 con { accessToken, refreshToken, user }

7. axios.ts interceptor de RESPONSE
   Respuesta 200 → la deja pasar sin tocarla.

8. authService devuelve la respuesta al hook.

9. useLogin.onSuccess
   Guarda tokens y usuario en el store → navega a '/'.

10. La página desaparece. Aparece el Dashboard.
```

Si las credenciales son incorrectas, el backend responde 401 con `{ message: 'Credenciales inválidas' }`.
El hook expone ese mensaje como `loginError`. La página lo pinta.

---

## Flujo completo — un GET (leer datos)

```
1. El componente monta en pantalla

2. Página usa el hook → useQuery se activa automáticamente

3. Hook → service.getAll() → api.get('/users')

4. axios.ts interceptor de REQUEST
   Lee el token del store → añade Authorization: Bearer xxx → envía.

5. Backend responde 200 con los datos

6. axios.ts interceptor de RESPONSE → deja pasar.

7. Hook recibe los datos → los expone como { data, isLoading: false }

8. Página pinta los datos.
```

Si el token expiró, el response interceptor de axios lo renueva solo en el paso 5-6,
sin que el hook ni la página lo sepan.

---

## Regla para saber dónde va cada cosa

| Pregunta                               | Va en          |
|----------------------------------------|----------------|
| ¿Renderiza UI?                         | Página         |
| ¿Decide qué hacer con una acción?      | Hook           |
| ¿Habla con el backend?                 | Service        |
| ¿Configura cómo se hacen los requests? | axios.ts       |
| ¿Datos que persisten entre pantallas?  | Store          |
| ¿Datos que solo usa un componente?     | useState local |
