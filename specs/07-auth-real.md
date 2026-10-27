# SPEC 07 � Autenticaci�n real con Supabase y protecci�n de rutas

> **Status:** Approved
> **Depends on:** SPEC 03
> **Date:** 2026-10-26
> **Objective:** Hacer funcional el login con email y password usando Supabase Auth, proteger todas las rutas excepto /login y /activar-cuenta, redirigir correctamente seg�n estado de sesi�n y a�adir cierre de sesi�n desde el sidebar.

## Scope

**In:**

- Autenticaci�n con email y password usando Supabase Auth (supabase.auth.signInWithPassword) v�a Server Action.
- Protecci�n de rutas con proxy.ts + utils/supabase/middleware.ts siguiendo el patr�n indicado en AGENTS.md. Usar supabase.auth.getClaims() para validar/refrescar sesi�n.
- Rutas p�blicas: �nicamente /login y /activar-cuenta. Cualquier otra ruta es privada.
- Redirecciones:
  - Usuario sin sesi�n intentando acceder a ruta privada ? redirigir a /login (sin next).
  - Usuario con sesi�n intentando acceder a /login o /activar-cuenta ? redirigir a /.
  - Tras login exitoso ? redirigir a /.
- Errores de login: mostrar mensaje gen�rico "Email o contrase�a incorrectos" en la UI cuando las credenciales sean incorrectas. No mostrar detalles espec�ficos.
- Logout funcional: el bot�n de cerrar sesi�n del sidebar (components/app-shell/Sidebar.tsx) debe ejecutar signOut y redirigir a /login.
- Integraci�n con UI existente: mantener el dise�o/estructura de LoginScreen de SPEC 03. A�adir manejo de estado para errores de autenticaci�n y env�o del formulario a Server Action.

**Out of scope:**

- Flujo funcional de /activar-cuenta.
- "Olvidaste tu contrase�a".
- Registro sin invitaci�n.
- Roles/permisos, autorizaci�n por recurso.
- Protecci�n a nivel de Route Handler/Server Action distinta a middleware/proxy.
- Cambios en la UI de /activar-cuenta.
- Recuperaci�n/verificaci�n de email, MFA.

## Data model

This feature introduces no new data structures. Only client state changes in the login form:

```ts
type LoginFormState = {
  email: string;
  password: string;
  showPassword: boolean;
  fieldErrors: { email: boolean; password: boolean };
  authError: string | null;
  isPending: boolean;
};
```

## Implementation plan

1. Crear Server Action para login en app/(auth)/login/actions.ts con "use server". Usar createClient(await cookies()) desde @/utils/supabase/server, llamar a supabase.auth.signInWithPassword. En error retornar { error: "Email o contrase�a incorrectos" }. En �xito redirect('/').
2. Actualizar components/auth/LoginScreen.tsx para usar useActionState, mantener validaci�n de campos vac�os, mostrar authError gen�rico, limpiar en onChange.
3. Crear Server Action para logout en app/actions/auth.ts con "use server". Usar createClient(await cookies()), supabase.auth.signOut(), redirect('/login').
4. Actualizar components/app-shell/Sidebar.tsx para usar form action={signOut} en lugar de Link a /login.
5. Actualizar utils/supabase/middleware.ts (invocado desde proxy.ts) siguiendo AGENTS.md: crear cliente, NO poner c�digo entre createServerClient y await supabase.auth.getClaims(). Usar getClaims() para validar sesi�n. Proteger todo excepto /login y /activar-cuenta; redirigir sin sesi�n a /login; con sesi�n en rutas p�blicas redirigir a /.
6. Verificar con npx tsc --noEmit y npx eslint app components utils proxy.ts.

## Acceptance criteria

- [ ] Solo /login y /activar-cuenta son accesibles sin sesi�n. Cualquier otra ruta redirige a /login si no hay sesi�n.
- [ ] Si hay sesi�n activa y se accede a /login o /activar-cuenta, se redirige a /.
- [ ] Login con credenciales correctas redirige a /.
- [ ] Login con credenciales incorrectas muestra "Email o contrase�a incorrectos" y no redirige.
- [ ] Al escribir en los campos tras error de auth, el mensaje se limpia.
- [ ] Validaci�n de campos vac�os de SPEC 03 sigue funcionando.
- [ ] Bot�n de logout en sidebar cierra sesi�n y redirige a /login.
- [ ] Tras logout, rutas privadas redirigen a /login.
- [ ] Protecci�n usa proxy.ts + utils/supabase/middleware.ts con supabase.auth.getClaims() sin c�digo entre createServerClient y getClaims().
- [ ] Cookies de sesi�n se preservan correctamente.
- [ ] npx tsc --noEmit y npx eslint app components utils proxy.ts pasan sin errores.

## Decisions

- **S�:** Server Actions para signIn/signOut.
- **S�:** proxy.ts + utils/supabase/middleware.ts con supabase.auth.getClaims() seg�n AGENTS.md.
- **S�:** Solo /login y /activar-cuenta p�blicas.
- **S�:** Sin next; tras login siempre a /.
- **S�:** Mensaje gen�rico "Email o contrase�a incorrectos".
- **S�:** Mantener validaci�n de campos vac�os + error de auth desde action.
- **S�:** Logout funcional en Sidebar con form+action.
- **No:** Hacer funcional /activar-cuenta.
- **No:** Usar getSession() para autorizar.

## Risks

| Risk | Mitigation |
| --- | --- |
| C�digo entre createServerClient y getClaims() rompe refresco | Seguir orden estricto seg�n AGENTS.md |
| Reemplazar NextResponse sin copiar cookies/headers | Usar patr�n existente en utils/supabase/middleware.ts |
| Loops en redirects | Solo /login y /activar-cuenta p�blicas |
| Cookies en Server Actions | Usar createClient(await cookies()) desde @/utils/supabase/server |

## What is **not** in this spec

- Flujo funcional de /activar-cuenta
- Recuperaci�n de contrase�a
- Registro/autoregistro
- Roles/permisos
- Protecci�n distinta a middleware
- Cambios visuales en login/activar-cuenta
- MFA
