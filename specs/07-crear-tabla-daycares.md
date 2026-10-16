# SPEC 07 — Primera tabla `daycares` en Supabase vía migración

> **Status:** Approved
> **Depends on:** ninguna (primer spec de base de datos)
> **Date:** 2026-10-16
> **Objective:** Crear la tabla `public.daycares` (name, address, created_at, updated_at, is_active) en el proyecto Supabase mediante una migración versionada en git y aplicada con el MCP, con RLS habilitado sin policies y 4 filas semilla.

## Por qué existe este spec

Hasta ahora todo el estado vive en memoria del proceso servidor (`data/*.ts`) y se pierde al reiniciar. Este spec es el primer paso de persistencia real y, además de la tabla, **fija el patrón de migraciones** que usarán todos los specs siguientes: archivo SQL en `supabase/migrations/` versionado en git + aplicación con `apply_migration` del MCP (el historial remoto ya tiene 2 migraciones de prueba hechas con ese flujo).

## Scope

**In:**

- Archivo nuevo `supabase/migrations/<version>_create_daycares.sql`, commiteable en git (`.gitignore` no ignora `supabase/`).
- Tabla `public.daycares`: `id uuid PK default gen_random_uuid()`, `name text NOT NULL`, `address text` (nullable), `created_at timestamptz default now()`, `updated_at timestamptz default now()`, `is_active boolean NOT NULL DEFAULT true`.
- `ALTER TABLE public.daycares ENABLE ROW LEVEL SECURITY` sin policies.
- 4 filas semilla (la original más 3 activas más), todas con `address` cargado e `is_active = true`, dentro de la misma migración.
- Aplicación con el MCP `apply_migration` y verificación con `list_tables`, `execute_sql`, `list_migrations` y `get_advisors`.

**Out of scope (for future specs):**

- Cualquier otra tabla del diccionario (`users`, `rooms`, `children`, `parent_children`, `invitations`, `posts`, ...).
- Policies de RLS y grants de la Data API para `anon` / `authenticated`: llegan con el spec de auth/usuarios.
- Cliente Supabase en la app (`@supabase/ssr`, `NEXT_PUBLIC_SUPABASE_URL`/keys en `.env`, types TS, `lib/supabase/`).
- Supabase CLI local (`supabase init`, `db push`): el patrón del repo es MCP + archivos locales.
- Seed de salas, niños o usuarios.
- Modificar código de la app (`app/`, `components/`, `data/`, `lib/`) ni `references/`.

## Data model

Tabla nueva `public.daycares` (diccionario `07-DB-Schema`, sección 1). Es la entidad raíz: todas las tablas futuras cuelgan de ella por `daycare_id`.

```sql
-- public.daycares
id          uuid        not null default gen_random_uuid()  -- PK
name        text        not null                            -- "Guardería Sala Soles"
address     text                                            -- "Av. Siempreviva 742, Springfield"
created_at  timestamptz not null default now()
updated_at  timestamptz not null default now()              -- cada UPDATE lo escribe a mano
is_active   boolean     not null default true               -- borrado lógico
```

Etiquetas UI (español, no se guardan en DB):

| Columna       | Etiqueta UI        |
| ------------- | ------------------ |
| `name`        | Nombre             |
| `address`     | Dirección          |
| `created_at`  | Fecha de creación  |
| `updated_at`  | Fecha de modificación |
| `is_active`   | Activo             |

Filas semilla:

| id              | name                       | address                         | created_at | updated_at | is_active |
| --------------- | -------------------------- | ------------------------------- | ---------- | ---------- | --------- |
| (uuid generado) | Guardería Sala Soles       | Av. Siempreviva 742, Springfield | `now()`    | `now()`    | `true`    |
| (uuid generado) | Guardería Los Girasoles    | Av. Primavera 1230              | `now()`    | `now()`    | `true`    |
| (uuid generado) | Jardín Infantil Arcoíris   | Calle del Sol 45                | `now()`    | `now()`    | `true`    |
| (uuid generado) | Guardería Pequeños Pasos   | Blvr. de los Niños 789          | `now()`    | `now()`    | `true`    |

Convenciones:

- Identifiers en minúscula, snake_case (regla general de Postgres del proyecto).
- Los enums y tags se persisten en inglés; el nombre y la dirección de la guardería son **datos** (nombres propios), no etiquetas de sistema, así que se guardan tal cual. Las etiquetas visibles se traducen en la UI (español).
- `updated_at` no tiene trigger: su valor lo escribe cada `UPDATE` explícitamente (ver Decisions).

## Implementation plan

> **Regla de avance:** al terminar cada paso, el agente publica un resumen breve (archivos creados/editados, qué quedó funcionando y qué verificó) y espera la confirmación del usuario antes de arrancar el siguiente paso.

1. Cargar las skills `supabase` y `supabase-postgres-best-practices` (obligatorio antes de escribir SQL, según `AGENTS.md`) y crear `supabase/migrations/<YYYYMMDDHHMMSS>_create_daycares.sql` con: `CREATE TABLE public.daycares (...)`, `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` y el `INSERT` con las 4 filas semilla, con una cabecera de comentario que documente el patrón (fuente: diccionario `07-DB-Schema`). Verificar: el archivo aparece como untracked en `git status`.
2. Aplicar la migración con el MCP `apply_migration({ name: "create_daycares", query })`, pasando **exactamente** el contenido del archivo local. Verificar: `list_migrations()` incluye `create_daycares`.
3. Sincronizar el nombre del archivo local con el `version` que asignó el servidor (renombrar si difiere), para mantener el formato `<timestamp>_name.sql` de Supabase. Verificar: `list_migrations()` y el nombre del archivo coinciden en el prefijo.
4. Verificación final en la DB: `list_tables({ schemas: ["public"], verbose: true })` muestra `daycares`; `execute_sql` con `select id, name, address, is_active from public.daycares` devuelve 4 filas; `select relrowsecurity from pg_class where relname = 'daycares'` es `t`; `select * from pg_policies where tablename = 'daycares'` devuelve 0 filas; `set role authenticated; select count(*) from public.daycares; reset role;` devuelve 0; `get_advisors("security")` sin avisos sobre `daycares`; `npx tsc --noEmit` y `npx eslint app` siguen pasando.

## Acceptance criteria

- [ ] Existe `supabase/migrations/<version>_create_daycares.sql` en el repo, con el prefijo de 14 dígitos del `version` remoto.
- [ ] `list_migrations()` (MCP) incluye `create_daycares` y su `version` coincide con el prefijo del archivo local.
- [ ] `list_tables({ schemas: ["public"], verbose: true })` muestra `daycares` con `id` (uuid, PK, default `gen_random_uuid()`), `name` (text, not null), `address` (text, nullable), `created_at` (timestamptz, default `now()`), `updated_at` (timestamptz, default `now()`) e `is_active` (boolean, not null, default `true`).
- [ ] `select name, address, is_active from public.daycares` devuelve exactamente 4 filas, todas con dirección cargada e `is_active = true`, incluyendo `Guardería Sala Soles`.
- [ ] `pg_class.relrowsecurity` es `true` para `daycares` y `pg_policies` no tiene filas para `daycares`.
- [ ] `set role authenticated; select count(*) from public.daycares;` devuelve 0 filas (RLS activo sin policies).
- [ ] `get_advisors("security")` no reporta `daycares` como tabla de `public` sin RLS.
- [ ] El SQL aplicado en Supabase es idéntico al del archivo local (mismo contenido).
- [ ] `npx tsc --noEmit` y `npx eslint app` siguen pasando sin errores.
- [ ] Ningún archivo de `app/`, `components/`, `data/`, `lib/` ni `references/` fue modificado.

## Decisions

- **Sí:** tabla única `daycares`: las 3 columnas del diccionario (`id`, `name`, `created_at`) + las 3 pedidas por el usuario (`address`, `updated_at`, `is_active`). Nada más.
- **Sí:** archivo local `supabase/migrations/...` versionado en git + `apply_migration` del MCP para el historial remoto (decisión del usuario). El repo queda como fuente de verdad del SQL; el historial de Supabase, como registro de lo aplicado.
- **Sí:** renombrar el archivo local al `version` real asignado por el MCP después de aplicar: `apply_migration` sólo acepta `name` + `query` y genera el timestamp solo, así que el prefijo local puede diferir en minutos y conviene alinearlos.
- **Sí:** `name not null`: el diccionario marca explícitamente "Nullable" cuando un campo puede ser nulo (`avatar_url`, `room_id`, `title`) y `name` no lo está.
- **Sí:** RLS habilitado sin policies (decisión del usuario): todavía no hay auth ni tabla `users`; con esto nadie lee ni escribe vía Data API y el advisor queda limpio.
- **Sí:** semilla de 4 guarderías activas en la misma migración (decisión del usuario): la original `Guardería Sala Soles` más 3 más (Los Girasoles, Jardín Infantil Arcoíris, Pequeños Pasos), todas con `address` cargado e `is_active = true`, para poblar la tabla desde el minuto uno.
- **Sí:** guardar nombre y dirección de la guardería en español: son datos (nombres propios), no etiquetas de sistema; la regla "en inglés" aplica a los nombres de columna, enums, tags y códigos, y las etiquetas visibles se traducen en la UI.
- **Sí:** columnas en inglés `address`, `created_at`, `updated_at`, `is_active` con etiquetas UI en español (decisión del usuario): respeta la convención del diccionario (`07-DB-Schema`) y se alinea con el resto del modelo futuro (`users.daycare_id`, `children.created_at`, ...).
- **Sí:** `address text` nullable, un solo campo libre (decisión del usuario): el formulario de alta no pide estructura y nada consume campos desglosados todavía; si se necesitan, se normaliza en su propio spec.
- **Sí:** `is_active boolean not null default true` (decisión del usuario): borrado lógico coherente con `child_status` del diccionario, sin nulls ambiguos.
- **No:** Supabase CLI ni `supabase init`: requiere login/token y config local; el MCP ya está configurado y los 2 test previos usaron ese flujo.
- **No:** trigger `set_updated_at()` que auto-mantiene `updated_at` (decisión del usuario): queda con `default now()` y cada `UPDATE` lo escribe explícitamente; es un riesgo asumido (ver Risks) y el trigger se puede agregar después en su propia migración.
- **No:** policies, grants de Data API ni exposición del schema: se resuelven junto con auth/usuarios en otro spec.
- **No:** `@supabase/ssr`, env vars o types TS en la app: nada los consume todavía.

## Risks

| Risk | Mitigation |
| --- | --- |
| El `version` que asigna el MCP difiere del timestamp local y rompe el formato `<timestamp>_name.sql` | Renombrar el archivo tras aplicar (paso 3) y verificar la coincidencia con `list_migrations` |
| `updated_at` queda congelado porque no hay trigger de auto-actualización | Todo `UPDATE` sobre `daycares` debe escribir `updated_at = now()` explícitamente; si se vuelve molest, el trigger se agrega en una migración propia |
| Re-ejecutar la migración duplicaría las 4 filas semilla | El patrón imperativo aplica cada migración una sola vez; no se reintegra a ciegas y no hay idempotencia por diseño |
| La tabla no aparece en la Data API (exposición del schema desactivada) | No bloquea: este spec no consume REST; la exposición y los grants se resuelven con el spec de acceso |
| Futuras tablas referencian `daycares(id)` sin política de lectura | Fuera de alcance consciente: el spec de auth/users define el modelo de acceso completo |

## What is **not** in este spec

- Otras 12 tablas del diccionario (`users`, `rooms`, `children`, `parent_children`, `invitations`, `posts`, `post_children`, `post_photos`, `reactions`, `comments`, `daily_summaries`, `devices`).
- Policies de RLS, grants y cualquier lectura desde la app.
- Cliente Supabase en Next.js, auth o migración de los datos mock de `data/*.ts` a la base.

Cada uno, si llega, va en su propio spec.
