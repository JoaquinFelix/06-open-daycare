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

## MCPs

- Playwright (screenshots, navegador): todo output va a la carpeta `.playwright-mcp/`
  (ya ignorada en `.gitignore` con `.playwright-mcp/*`).
- context7: usar este MCP para traer la documentación actualizada del framework antes de codear
  APIs de Next/React.

## Skills

- `spec` y `spec-impl` instalados vía `skills-lock.json` (fuente: `klerith/fernando-skills`) para
  desarrollo de features guiado por specs.
