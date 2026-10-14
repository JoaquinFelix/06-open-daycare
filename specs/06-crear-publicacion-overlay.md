# SPEC 06 — Overlay "Nueva publicación" desde el sidebar

> **Status:** Implemented
> **Depends on:** SPEC 01
> **Date:** 2026-10-13
> **Objective:** Replicar `references/pantallas/crear-publicacion.dc.html` en `/crear-publicacion` como superposición (overlay) lanzada desde el botón "Nueva publicación" del sidebar, con secciones PARA, TIPO, DESCRIPCIÓN y FOTOS, y cierre del overlay ante cualquier navegación.

## Scope

**In:**

- `/crear-publicacion` deja de ser un `PlaceholderPage` y pasa a renderizar el overlay con la tarjeta del mockup (max-width 580px).
- Intercepting route `app/(app)/@modal/(.)crear-publicacion/page.tsx`: al abrir desde el botón "Nueva publicación" del sidebar, el overlay aparece sobre el feed (la URL cambia a `/crear-publicacion`); al cargar esa URL directo también responde 200 con el overlay. Mismo patrón que `/kids/new` y `/kids/[id]/link-parent`.
- Tarjeta fiel al mockup: header con "Cancelar", título "Nueva publicación" y botón "Publicar"; sección PARA con chips de niños (Mateo, Sofía, Benjamín) + "Toda la sala"; sección TIPO con los 7 chips de colores; DESCRIPCIÓN (textarea); FOTOS (placeholder + tile "Agregar").
- Server Action `createPost` que valida y redirige a `/` (no hay backend ni store de posts todavía).
- Cierre del overlay ante cualquier navegación (envío, redirect, Link), con un guard de pathname en `app/(app)/@modal/layout.tsx`.
- Responsive igual que el resto: la tarjeta no supera el ancho disponible en móvil.

**Out of scope (for future specs):**

- Persistencia real de publicaciones ni backend.
- Subida real de fotos.
- Feed del lado de la familia (`familia-feed.dc.html`), notificaciones y permisos del padre.

## Data model

No se modifican tipos existentes. El formulario es de cliente con estado local.

Estado de cliente del formulario:

```ts
// components/feed/PostForm.tsx
type PostFormValues = {
  recipients: string[]; // ids de niños seleccionados + opcional "toda-sala"
  type: string; // uno de POST_TYPES (por ahora sin selección obligatoria)
  description: string;
};
```

Colores del mockup usados inline (sin tokens nuevos en `app/globals.css`):

| Uso | Valor |
| --- | --- |
| Tarjeta | `#FBF4EC`, borde `#ECE0D0`, radio 24px |
| Chip seleccionado (PARA) | fondo `#3F362E`, texto `#fff` |
| Chip sin seleccionar (PARA) | fondo `#FFFDF9`, borde `#ECE0D0`, texto `#6E6359` |
| Borde de textarea | `#EADFD0` |
| Botón "Publicar" | color `#D9583C` |
| Botón "Cancelar" | color `#94887B` |

## Implementation plan

1. Crear `components/feed/PostForm.tsx` (`"use client"`): header con "Cancelar" (router.back), título "Nueva publicación" y botón "Publicar" (type submit); sección PARA con chips de niños (Mateo, Sofía, Benjamín) + "Toda la sala"; sección TIPO con los 7 chips de colores; DESCRIPCIÓN (textarea); FOTOS (placeholder + tile "Agregar"). Recibe `action` como prop.
2. Crear `app/(app)/crear-publicacion/actions.ts` (`"use server"`): `createPost(formData)` que valida y redirige a `/`. Redirección fuera de try/catch.
3. Reemplazar `app/(app)/crear-publicacion/page.tsx`: quitar `PlaceholderPage`, agregar `metadata`, `PostForm` dentro de `KidModalShell` (maxWidth 580). Mismo patrón que `app/(app)/kids/new/page.tsx:12-17`.
4. Crear `app/(app)/@modal/(.)crear-publicacion/page.tsx`: mismo contenido que el paso 3 para interceptar la navegación desde el sidebar. Mismo patrón que `app/(app)/@modal/(.)kids/new/page.tsx:10-15`.
5. Actualizar `app/(app)/@modal/layout.tsx:10`: agregar `/^\/crear-publicacion$/` a `MODAL_ROUTES` para que el overlay se cierre ante cualquier navegación.
6. Verificación: `npx tsc --noEmit`, `npx eslint app components data lib`, `npm run build`, y con Playwright en `npm run dev`: apertura desde el botón "Nueva publicación" del sidebar (`components/app-shell/Sidebar.tsx:33-40`), cierre con "Cancelar", carga directa de `/crear-publicacion`, y comparación por screenshot a 1280px contra `crear-publicacion.dc.html`.

## Acceptance criteria

- [x] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [x] `npx eslint app components data lib` pasa sin errores.
- [x] Desde `/`, clic en "Nueva publicación" del sidebar abre el overlay sobre el feed con la tarjeta de 580px y la URL pasa a `/crear-publicacion`.
- [x] El overlay muestra "Cancelar", "Nueva publicación", "Publicar", PARA con chips de Mateo/Sofía/Benjamín y "Toda la sala", TIPO con los 7 colores, DESCRIPCIÓN con placeholder "Contá cómo le fue hoy...", FOTOS con placeholder y "Agregar".
- [x] Clic en un chip de PARA o TIPO alterna su selección visualmente.
- [x] "Cancelar" cierra el overlay y vuelve al feed sin enviar.
- [x] Cargar directo `/crear-publicacion` responde 200 con el overlay.
- [x] El envío con datos válidos navega a `/` (por ahora sin persistencia).
  - Evidencia: Playwright (dev): con chip Mateo + descripción válidos, clic "Publicar" → URL `http://localhost:3000/`, overlay desmontado; recarga de `/` → feed con sólo los 3 posts estáticos, sin rastro del post de prueba (verificado con `browser_find` y `innerText`). `createPost` (`app/(app)/crear-publicacion/actions.ts`) sólo valida y redirige; se eliminó el store en memoria (`addPost`/`getAllFeedPosts` en `data/feed.ts`) y se revirtió `FeedTag` a sus 3 valores originales. Verificado también con `npx tsc --noEmit`, `npx eslint app components data lib` y `npm run build` (OK).
- [x] A 1280px el overlay coincide con `references/pantallas/crear-publicacion.dc.html`.
- [x] `references/` no fue modificado.

## Decisions

- **Sí:** intercepting route `@modal/(.)crear-publicacion` + ruta real, mismo patrón que `/kids/new` y `/kids/[id]/link-parent`.
- **Sí:** validación básica obligatoria en cliente (al menos un destinatario y descripción no vacía) y re-validación en servidor.
- **No:** persistencia real de publicaciones ni backend: el formulario valida y redirige al feed.
- **No:** subida real de fotos: la sección FOTOS es visual.

## Risks

| Risk | Mitigation |
| --- | --- |
| El overlay no se cierra al navegar hacia adelante desde la ruta interceptada | Guard de pathname en `@modal/layout.tsx`; verificar con Playwright |
| El intercepting route con ruta estática no matchea por `cacheComponents` | Verificar con Playwright la apertura desde el sidebar y la carga directa |
