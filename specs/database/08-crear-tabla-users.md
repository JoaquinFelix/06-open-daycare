# SPEC 08 — Tabla `users` y enums de usuario en Supabase

> **Status:** Implemented
> **Depends on:** SPEC 07
> **Date:** 2026-10-26
> **Objective:** Crear en Supabase los enums `user_role`/`user_status` y la tabla `public.users` (muchos usuarios por daycare, con RLS por fila y por daycare) más un usuario staff de prueba autenticable, mediante una migración versionada y un script de seed re-ejecutable.

## Por qué existe este spec

El spec 07 creó `daycares` y dejó explícito que `users` y las policies de acceso llegaban después. Este spec agrega la identidad de dominio (staff/padres/admin) y el primer modelo de acceso real, sin conectar todavía la app a Supabase. También fija el patrón para crear usuarios de Auth desde un script, porque el proyecto no tiene auth ni cliente de Supabase en Next.js.

La relación pedida es 1:N: un daycare tiene muchos usuarios y cada usuario pertenece a un único daycare (`daycare_id NOT NULL`).

## Scope

**In:**

- Archivo `supabase/migrations/<version>_create_users.sql`, commiteable en git.
- Enums `public.user_role` (`staff`, `parent`, `admin`) y `public.user_status` (`pending`, `active`).
- Tabla `public.users` con todas las columnas del diccionario (`07-DB-Schema`, sección 2), FK `daycare_id → public.daycares(id)` con `ON DELETE RESTRICT`, índice por `daycare_id` y trigger de `updated_at`.
- RLS activo con 3 policies (propia fila, staff/admin del mismo daycare, update propio) y grants mínimos por columna.
- Esquema `private` con las funciones helper `current_daycare_id()` y `current_user_role()` para evitar recursión de RLS.
- Script `scripts/seed-staff-user.mjs` + entrada `seed:staff` en `package.json`: crea o reutiliza el usuario de Auth `fmjoaquin@gmail.com` (password `123456`, email confirmado) vía Admin API y hace upsert del perfil staff en `Guardería Sala Soles`.
- Placeholders `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` en `.env.template`; los valores reales van solo en `.env` (gitignored).
- Verificación con MCP (`list_tables`, `list_migrations`, `execute_sql`, `get_advisors`) y login real por password contra `/auth/v1/token`.

**Out of scope (for future specs):**

- FK `users.id → auth.users(id)`: se agrega en el spec de auth cuando exista el flujo de signup y se hayan auditado huérfanos.
- Trigger `AFTER INSERT` en `auth.users` (signup automático).
- Las otras 4 enums (`relationship_type`, `invitation_status`, `post_type`, `child_status`) y las otras 11 tablas del diccionario.
- Policies de `daycares`, grants de lectura de `daycares` y cualquier join desde la app.
- Cliente Supabase en Next.js (`@supabase/ssr`, `lib/supabase/`, types TS), login/logout en la UI y migración de los mock de `data/*.ts`.
- Seed de padres, admins o usuarios en otras guarderías.
- Modificar `app/`, `components/`, `data/`, `lib/` ni `references/`.

## Data model

### Enums

| Enum | Valores DB | Etiqueta UI |
| --- | --- | --- |
| `public.user_role` | `staff` | Staff |
| `public.user_role` | `parent` | Padre/Tutor |
| `public.user_role` | `admin` | Administrador |
| `public.user_status` | `pending` | Pendiente |
| `public.user_status` | `active` | Activo |

Los valores se persisten en inglés; la UI traduce.

### Tabla `public.users`

| Campo | Tipo | Null | Default | Notas |
| --- | --- | --- | --- | --- |
| `id` | `uuid` PK | no | `gen_random_uuid()` | Convención: mismo UUID que `auth.users.id`. Sin FK por ahora. |
| `daycare_id` | `uuid` FK → `daycares` | no | — | `ON DELETE RESTRICT`. |
| `role` | `user_role` | no | — | `staff` / `parent` / `admin`. |
| `status` | `user_status` | no | `active` | |
| `full_name` | `text` | no | — | |
| `avatar_url` | `text` | sí | — | |
| `notify_on_post` | `boolean` | no | `true` | |
| `daily_summary_enabled` | `boolean` | no | `true` | |
| `created_at` | `timestamptz` | no | `now()` | |
| `updated_at` | `timestamptz` | no | `now()` | Trigger `BEFORE UPDATE`. |

```sql
create type public.user_role   as enum ('staff', 'parent', 'admin');
create type public.user_status as enum ('pending', 'active');

create table public.users (
  id                    uuid                primary key default gen_random_uuid(),
  daycare_id            uuid                not null references public.daycares(id) on delete restrict,
  role                  public.user_role    not null,
  status                public.user_status  not null default 'active',
  full_name             text                not null,
  avatar_url            text,
  notify_on_post        boolean             not null default true,
  daily_summary_enabled boolean             not null default true,
  created_at            timestamptz         not null default now(),
  updated_at            timestamptz         not null default now()
);

comment on column public.users.id is
  'Convención: mismo UUID que auth.users.id. FK pendiente hasta el spec de auth.';

create index users_daycare_id_idx on public.users (daycare_id);
```

### Acceso (RLS + grants)

```sql
create schema if not exists private;

-- Ambas funciones: SQL, STABLE, SECURITY DEFINER, SET search_path = ''.
-- Consultan public.users filtrando por (select auth.uid()); devuelven null si no hay perfil.
private.current_daycare_id()  returns uuid
private.current_user_role()   returns public.user_role

-- Trigger reutilizable
private.set_updated_at()      returns trigger  -- NEW.updated_at = now()

alter table public.users enable row level security;

-- SELECT: propia fila
using (id = (select auth.uid()))

-- SELECT: staff/admin del mismo daycare
using (
  (select private.current_user_role()) in ('staff', 'admin')
  and daycare_id = (select private.current_daycare_id())
)

-- UPDATE: propia fila (las columnas editables las limita el grant)
using (id = (select auth.uid()))
with check (id = (select auth.uid()))
```

| Policy | Comando | Rol | Regla |
| --- | --- | --- | --- |
| `users_select_own` | SELECT | `authenticated` | `id = auth.uid()` |
| `users_select_same_daycare_staff` | SELECT | `authenticated` | staff/admin y mismo `daycare_id` |
| `users_update_own` | UPDATE | `authenticated` | `id = auth.uid()` |

```sql
revoke all on public.users from anon, authenticated;
grant select on public.users to authenticated;
grant update (full_name, avatar_url, notify_on_post, daily_summary_enabled)
  on public.users to authenticated;

grant usage on type public.user_role, public.user_status to authenticated;
grant usage on schema private to authenticated;
grant execute on function private.current_daycare_id(), private.current_user_role()
  to authenticated;
```

Sin policies de `INSERT` ni `DELETE`: el alta de perfiles queda para el trigger de signup del spec de auth. `service_role` conserva sus grants y bypassa RLS para el seed.

### Seed del staff

| Dato | Valor |
| --- | --- |
| Email Auth | `fmjoaquin@gmail.com` |
| Password Auth | `123456` |
| `email_confirm` | `true` |
| `user_metadata` | `{ "full_name": "Staff de Prueba" }` |
| `public.users.role` | `staff` |
| `public.users.status` | `active` |
| `public.users.full_name` | `Staff de Prueba` |
| `public.users.daycare_id` | id de `Guardería Sala Soles`, resuelto por nombre |
| `avatar_url` | `null` |
| `notify_on_post` / `daily_summary_enabled` | `true` / `true` |

El UUID del perfil se toma del usuario creado por Auth en tiempo de ejecución; no se hardcodea en la migración ni en el script.

## Implementation plan

> **Regla de avance:** al terminar cada paso, el agente publica un resumen breve (archivos creados/editados, qué quedó funcionando y qué verificó) y espera la confirmación del usuario antes de arrancar el siguiente paso.

1. Cargar las skills `supabase` y `supabase-postgres-best-practices` y crear `supabase/migrations/<YYYYMMDDHHMMSS>_create_users.sql` con enums, tabla, FK, índice, esquema `private` + helpers + trigger, RLS, policies y grants. Verificar: el archivo aparece como untracked en `git status`.
2. Aplicar la migración con `apply_migration({ name: "create_users", query })` pasando exactamente el contenido del archivo local. Verificar: `list_migrations()` incluye `create_users`.
3. Renombrar el archivo local al `version` que asignó el servidor. Verificar: prefijo de 14 dígitos == `version` remoto.
4. Verificar el schema con `list_tables({ schemas: ["public"], verbose: true })` y `execute_sql`: columnas/tipos/defaults, enums, FK `daycare_id`, ausencia de FK en `id`, índice y policies. Simular JWT con `set_config('request.jwt.claims', ...)` + `set local role authenticated` dentro de una transacción: propia fila, fila temporal del mismo daycare visible, fila temporal de otro daycare invisible, UUID sin perfil = 0 filas, `anon` con `permission denied`, update de `full_name` permitido (y `updated_at` cambia solo) y update de `role` denegado. Rollback al final.
5. Crear `scripts/seed-staff-user.mjs` y la entrada `"seed:staff": "node --env-file=.env scripts/seed-staff-user.mjs"` en `package.json`; agregar los placeholders a `.env.template`. El usuario agrega `SUPABASE_SERVICE_ROLE_KEY` y `NEXT_PUBLIC_SUPABASE_URL` al `.env`. Ejecutar `npm run seed:staff` y verificar: 1 fila en `auth.users` con `email_confirmed_at` no nulo y 1 perfil staff en `public.users` apuntando a Sala Soles.
6. Verificar login real: `POST /auth/v1/token?grant_type=password` con la publishable/anon key del proyecto (obtenida por MCP, no commiteada) devuelve 200 + `access_token`. Re-ejecutar `npm run seed:staff` para probar idempotencia. Ejecutar `npx tsc --noEmit` y `npx eslint app`.
7. Verificación final: `get_advisors("security")` sin findings de severidad ERROR/WARN sobre `users`, sus policies o las funciones de `private`; `list_tables` confirma la tabla y `git status` confirma que no se tocó código de la app.

## Acceptance criteria

- [x] `supabase/migrations/<version>_create_users.sql` existe y su prefijo de 14 dígitos coincide con el `version` de `create_users` en `list_migrations()`.
- [x] `list_tables({ schemas: ["public"], verbose: true })` muestra `public.users` con las 10 columnas, tipos, nullability y defaults de la tabla de Data model.
- [x] `pg_enum` devuelve exactamente `staff, parent, admin` para `user_role` y `pending, active` para `user_status`.
- [x] `users.daycare_id` es `NOT NULL`, FK a `daycares(id)` con `ON DELETE RESTRICT`; `users.id` no tiene FK a `auth.users`.
- [x] Existe el índice `users_daycare_id_idx` sobre `users(daycare_id)`.
- [x] `pg_class.relrowsecurity` es `true` para `users` y `pg_policies` lista las 3 policies con los comandos y roles esperados.
- [x] Con JWT simulado del staff, `select * from public.users` devuelve su fila y las del mismo daycare; una fila temporal de otro daycare no aparece.
- [x] Con JWT simulado de un UUID sin perfil, `select * from public.users` devuelve 0 filas.
- [x] `set role anon; select * from public.users;` falla con `permission denied`.
- [x] Con JWT simulado del staff, `update public.users set full_name = ...` afecta 1 fila y actualiza `updated_at` sin enviarlo; `update ... set role = 'admin'` falla por falta de grant de columna.
- [x] `auth.users` contiene `fmjoaquin@gmail.com` con `email_confirmed_at` no nulo y `public.users` contiene exactamente 1 perfil con `role = 'staff'`, `status = 'active'`, `full_name = 'Staff de Prueba'`, `daycare_id` = Sala Soles y ambos booleanos en `true`.
- [x] `POST /auth/v1/token?grant_type=password` con email/password devuelve 200 y un `access_token`.
- [x] Ejecutar `npm run seed:staff` dos veces deja 1 usuario en `auth.users` y 1 fila en `public.users`.
- [x] `npx tsc --noEmit` y `npx eslint app` pasan sin errores.
- [x] `get_advisors("security")` no reporta findings de severidad ERROR/WARN sobre `public.users`, sus policies o las funciones de `private`.
- [x] Ningún archivo de `app/`, `components/`, `data/`, `lib/` ni `references/` fue modificado.

## Decisions

- **Sí:** sin FK `users.id → auth.users(id)` por ahora (decisión del usuario): evita bloquear el seed mientras no existe el flujo de signup; el vínculo se documenta con un `comment` y se formaliza en el spec de auth.
- **Sí:** una sola tabla `users` con `role` (`staff`/`parent`/`admin`) en vez de tablas separadas: el perfil es uno solo y el rol diferencia accesos.
- **Sí:** `daycare_id NOT NULL` + `ON DELETE RESTRICT`: todo usuario pertenece a una guardería y borrar una con usuarios queda bloqueado; `daycares` usa baja lógica (`is_active`).
- **Sí:** solo los 2 enums de usuario; los otros 4 llegan con sus tablas.
- **Sí:** todas las columnas del diccionario, incluidos `avatar_url`, `notify_on_post` y `daily_summary_enabled`.
- **Sí:** `status` default `active` y `role` obligatorio sin default.
- **Sí:** RLS con 3 policies y grants por columna (decisión del usuario): el staff ve su daycare, cada usuario edita solo sus datos de perfil.
- **Sí:** helpers en `private` con `SECURITY DEFINER`: evitan la recursión de una policy que consulta su propia tabla y no se exponen por RPC al no estar el schema en la Data API.
- **Sí:** trigger de `updated_at` (decisión del usuario), a diferencia de `daycares` del spec 07: el UPDATE está limitado por columnas y el cliente no tendría permiso para escribir el timestamp.
- **Sí:** seed vía Admin API + REST upsert desde un script (decisión del usuario): re-ejecutable, sin credenciales en el repo y sin inserts frágiles en `auth.users`.
- **Sí:** `user_metadata` solo con `full_name`: `role` y `daycare_id` no van en metadata editable por el usuario; el futuro trigger de signup los resolverá server-side.
- **Sí:** el UUID del perfil se toma del auth user en tiempo de ejecución; no se hardcodea en la migración (regla del MCP).
- **No:** trigger `AFTER INSERT` en `auth.users` (decisión del usuario): depende del signup que todavía no existe.
- **No:** cliente Supabase/auth en la app: va en su propio spec.
- **No:** grants ni policies sobre `daycares`: queda como en el spec 07.

## Risks

| Risk | Mitigation |
| --- | --- |
| Sin FK, un perfil queda huérfano si se borra el auth user | El script hace upsert por `id`; antes de agregar la FK en el spec de auth, auditar huérfanos y usar `ON DELETE CASCADE` |
| `service_role` key en `.env` | `.env` está gitignored; el script no imprime la key; rotar si se filtra |
| Password `123456` es débil | Credencial solo de demo; rotar antes de cualquier uso real |
| Policies no probadas contra un JWT real de la app | Verificación con claims simulados en SQL + login real contra `/auth/v1/token` |
| Renombrar `Guardería Sala Soles` rompe el seed | El script falla con mensaje explícito si no encuentra exactamente una coincidencia |
| RLS recursiva por consultar `users` dentro de una policy de `users` | Helpers `SECURITY DEFINER` en `private`; verificación del paso 4 |
| `public` está expuesto en la Data API | Grants mínimos + RLS; `anon` sin acceso y verificado con `permission denied` |

## What is **not** in este spec

- FK a `auth.users`, trigger de signup y flujo de registro/login en la app.
- Las otras 4 enums y las otras 11 tablas del diccionario.
- Policies o grants de `daycares`, y cualquier consulta desde Next.js.
- Cliente `@supabase/ssr`, types TS generados y migración de los datos mock.
- Seed de padres, admins o usuarios de otras guarderías.

Cada uno, si llega, va en su propio spec.
