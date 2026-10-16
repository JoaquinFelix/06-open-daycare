<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Proyecto

- Next.js 16.4 (App Router + Turbopack) + React 19.3 + Tailwind 4. Un solo paquete, sin monorepo.
- `app/` todavía es el starter de create-next-app. La UI objetivo del curso está en
  `references/pantallas/*.dc.html` (mockups autocontenidos, ábrelos en el navegador para ver las
  pantallas) y `references/screenshots/`. `references/` es material de diseño: no editar ni "arreglar".
- Alias de rutas: `@/*` → raíz del repo (`tsconfig.json`).

## Comandos (verificados)

- `npm run dev` — servidor de desarrollo.
- `npm run build` — verificación completa: compila + typecheck de TypeScript. No existe script
  `typecheck`; para un chequeo rápido usa `npx tsc --noEmit`.
  (El warning de `bun.lock` fuera del repo viene del home del usuario, no del proyecto: ignorarlo.)
- `npm run lint` — **falla actualmente** con 2 errores preexistentes en
  `references/pantallas/support.js` (runtime de los mockups, no es código de la app). Para verificar
  solo tu código: `npx eslint app` (pasa limpio).
- No hay framework de tests ni scripts de test: no inventes comandos de test.
- Lint y build son lentos en la primera ejecución (cold cache): usa timeouts grandes.

## Next.js 16

- El bloque superior lo escribe y re-escribe `next dev`: no lo borres, commitealo con tu trabajo.
- `cacheComponents: true` y `partialPrefetching` están activos en `next.config.ts`, y
  `experimental.agentFeedback` habilitado: cambian el comportamiento por defecto de `fetch`,
  caching y routing. Lee `node_modules/next/dist/docs/` antes de usar `force-dynamic`,
  `revalidate`, `routerCache` u otras convenciones de versiones anteriores.
- Tailwind 4 no usa `tailwind.config`: se conecta vía el loader `@tailwindcss/turbopack` en
  `next.config.ts` + `@import "tailwindcss"` y los tokens `@theme inline` en `app/globals.css`.

## Supabase

- Proyecto `ytbnpptjvpyusmfsccet`. El **schema de la base** está en `../07-DB-Schema`
  (referencia `docs` de `opencode.json`): diccionario de tablas, ENUMs y convenciones. Todo lo que
  se persiste va en **inglés**; las etiquetas visibles se traducen en la UI (español).
- Credenciales: `SUPABASE_DB_PASSWORD` en `.env` (plantilla en `.env.template`, ya ignorado por
  git). Nunca commitear `.env` ni hardcodear secretos.
- Antes de tocar la DB (tablas, columnas, migraciones, RLS, índices, SQL) **cargá la skill
  `supabase-postgres-best-practices`** y para cualquier tarea de Supabase cargá `supabase`.
  Supabase cambia seguido: verificá contra el changelog y la doc actual antes de implementar.
- Toda tabla en un schema expuesto (`public`) debe tener RLS habilitado con policies acordes al
  modelo de acceso. Verificá cada cambio con una query real, no lo asumas.
- **Todo cambio de schema** pasa por una migración versionada: creá el archivo
  `supabase/migrations/<YYYYMMDDHHMMSS>_nombre_corto.sql` (commiteable en git, fuente de
  verdad del SQL) y aplicalo con `apply_migration` del MCP. Después renombrá el archivo al
  `version` que asignó el servidor para mantener el formato `<timestamp>_name.sql`. Nunca
  corras SQL de schema ad-hoc sin dejar su migración en el repo (tablas, columnas, RLS,
  índices, funciones, triggers, seeds iniciales). Las correcciones de datos aisladas (un
  `UPDATE` puntual, arreglar filas) sí pueden ir directo por `execute_sql`, sin migración.

## MCPs

- Playwright (screenshots, navegador): todo output va a la carpeta `.playwright-mcp/`
  (ya ignorada en `.gitignore` con `.playwright-mcp/*`).
- context7: usar este MCP para traer la documentación actualizada del framework antes de codear
  APIs de Next/React.
- supabase: MCP remoto configurado en `~/.config/opencode/opencode.json` (project_ref
  `ytbnpptjvpyusmfsccet`). Usalo para inspeccionar tablas, leer logs y aplicar migraciones. Antes
  de cambiar el schema, inspeccioná las tablas existentes y revisá los advisories de seguridad.

## Skills

- `.agents/skills/` — skills del proyecto:
  - `spec` y `spec-impl` (fuente `klerith/fernando-skills`, vía `skills-lock.json`): desarrollo de
    features guiado por specs.
  - `supabase`: cualquier tarea de Supabase (DB, Auth, Realtime, Storage, Edge Functions, RLS,
    clientes `supabase-js`/`@supabase/ssr`, CLI, MCP, debugging).
  - `supabase-postgres-best-practices`: reglas de Postgres (schema, migraciones, RLS, índices,
    performance, concurrencia). Cargala **antes** de escribir o modificar SQL/schema.

## Agentes

- `spec-checker` (`.opencode/agents/spec-checker.md`) — subagente que verifica los criterios de
  aceptación de un spec en `specs/`:
  - Marca `- [x]` solo con evidencia real: build, typecheck, lint, render con Playwright y
    comparación contra los mockups de `references/pantallas/`.
  - Usa `npx eslint app` (no `npm run lint`, que falla por errores preexistentes) y
    `npx tsc --noEmit`; no inventa comandos de test.
  - Editá únicamente `specs/*.md`: nunca toca código de la app, `references/` ni hace commit.
  - Propone cambiar el `Status` del spec a `Implemented` solo si todos los criterios pasan, y
    espera confirmación explícita antes de editar esa línea.
  - Invocación: pasá el nombre del spec (`01-feed-home`), el número (`01`) o la ruta
    (`specs/01-feed-home.md`); vacío lista `specs/` y pregunta cuál verificar.
