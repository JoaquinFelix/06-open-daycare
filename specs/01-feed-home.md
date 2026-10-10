# SPEC 01 — Home (feed) fiel al mockup

> **Status:** Implemented
> **Depends on:** —
> **Date:** 2026-10-09
> **Objective:** Replicar `references/pantallas/feed.dc.html` como Home (`/`) con estilo idéntico, un shell compartido de sidebar y rutas placeholder para el resto de pantallas.

## Scope

**In:**

- Home `/` que reproduce el feed del mockup: sidebar, botón "Nueva publicación", encabezado "Buenas, Caro", composer y los 3 posts (logro, actividad con foto, anuncio).
- Estilo idéntico al mockup: paleta, tipografías Fredoka/Nunito, radios, sombras, espaciados y tags de color.
- Tokens de diseño en `app/globals.css` (`@theme inline` de Tailwind 4) derivados del mockup.
- Shell compartido `AppShell` (sidebar + área de contenido) aplicado en `app/(app)/layout.tsx`.
- Ítem activo del sidebar dinámico según `usePathname()`.
- Responsive: a partir de `768px` (md) se ve el sidebar; por debajo se oculta y aparece un top bar con logo + botón hamburguesa que abre un menú deslizable.
- 7 rutas placeholder con el mismo lenguaje visual: `/ninos`, `/avisos`, `/mi-cuenta`, `/crear-publicacion`, `/detalle-publicacion`, `/foto` y `/login`.
- `/login` sin sidebar, vía route group `app/(auth)/`.
- Fuentes Fredoka + Nunito cargadas con `<link>` de Google Fonts.
- `lang="es"` y metadata propia en `app/layout.tsx`.

**Out of scope (for future specs):**

- Autenticación real (login funcional, sesión, roles).
- Base de datos o persistencia (todo el contenido es mock en memoria).
- Funcionalidad de los placeholders (crear publicación, detalle, niños, avisos, etc. sólo renderizan placeholder).
- Datos dinámicos reales o fetch.

## Data model

Contenido mock tipado, sin persistencia.

```ts
// data/feed.ts
export type FeedTag = "logro" | "actividad" | "anuncio";

export type FeedPost = {
  id: string;
  tag: FeedTag;
  author: { name: string; initial: string }; // ej. { name: "Mateo", initial: "M" }
  time: string;        // "14:20"
  authorNote: string;  // "publicado por vos"
  audience: string;    // "Para: familia de Mateo" | "Para: toda la sala"
  body: string;
  photoLabel?: string; // sólo post de actividad: "Foto · pintando con témperas"
  likes: number;
  comments: number;
};

export const feedPosts: FeedPost[] = [/* 3 posts del mockup */];
```

```ts
// data/nav.ts
export type NavItem = { href: string; label: string; icon: IconName };

export const navItems: NavItem[] = [
  { href: "/",            label: "Feed",      icon: "home" },
  { href: "/ninos",       label: "Niños",     icon: "children" },
  { href: "/avisos",      label: "Avisos",    icon: "bell" },
  { href: "/mi-cuenta",   label: "Mi cuenta", icon: "user" },
];
```

Tokens en `app/globals.css` (`@theme inline`), con nombres concretos:

```css
--color-cream: #F6ECDF;        /* fondo app */
--color-surface: #FFFDF9;      /* tarjetas / sidebar */
--color-line: #ECE0D0;         /* bordes */
--color-ink: #3F362E;          /* texto principal */
--color-ink-soft: #94887B;     /* texto secundario */
--color-ink-muted: #A89A8B;    /* texto terciario */
--color-primary: #E0654A;      /* acento (likes, iconos) */
--color-primary-strong: #D9583C;
--color-primary-deep: #C5503A; /* "Editar" */
--font-display: "Fredoka", system-ui, sans-serif;
--font-body: "Nunito", system-ui, sans-serif;
```

Tags (valores exactos del mockup): LOGRO `#CFEBD8`/`#3E9B6C`, ACTIVIDAD `#C7E7F1`/`#2E89A6`, ANUNCIO `#CCD8F4`/`#4E72C8`.

## Implementation plan

1. Crear `data/nav.ts` y `data/feed.ts` con los tipos y el contenido mock. Estado: compila, aún no se usa.
2. Reescribir `app/globals.css` con los tokens `@theme inline` y estilos base (fondo crema, tipografía, scrollbar). Actualizar `app/layout.tsx`: `lang="es"`, metadata, `<link>` de Fredoka/Nunito, `children` sin Geist. Verificar: `npm run dev` muestra fondo crema.
3. Crear `components/ui/icons.tsx` con los SVG inline del mockup (home, children, bell, user, plus, camera, heart, comment, megaphone, logout, hamburger, close).
4. Crear `components/ui/PlaceholderPage.tsx`: tarjeta centrada, título + "En construcción" + link a `/`, usando tokens.
5. Crear `components/app-shell/Sidebar.tsx`: logo, botón "Nueva publicación", nav (activo según prop), footer de usuario. Visible desde `md`.
6. Crear `components/app-shell/AppShell.tsx` (`"use client"`): sidebar + top bar móvil + drawer con estado abierto/cerrado y `usePathname()`. Crear `app/(app)/layout.tsx` que envuelve `children` con `AppShell`.
7. Crear `components/feed/TagBadge.tsx`, `FeedHeader.tsx`, `Composer.tsx` y `PostCard.tsx`.
8. Crear `app/(app)/page.tsx`: renderiza `FeedHeader`, `Composer` y `feedPosts.map(PostCard)`. Eliminar el `app/page.tsx` starter.
9. Crear las 6 rutas placeholder bajo `app/(app)/` (`ninos`, `avisos`, `mi-cuenta`, `crear-publicacion`, `detalle-publicacion`, `foto`) y `app/(auth)/login/page.tsx` sin shell.
10. Verificar: `npm run build`, `npx eslint app components data`, y comparación por screenshot contra el mockup a 1280px.

## Acceptance criteria

- [x] `npm run build` termina sin errores de TypeScript.
- [x] `npx eslint app components data` pasa sin errores.
- [x] `/` renderiza el sidebar de 248px, el encabezado "Buenas, Caro", el composer y los 3 posts del mockup.
- [x] Colores, tipografías (Fredoka/Nunito), radios, sombras y espaciados coinciden con `references/pantallas/feed.dc.html` a 1280px.
- [x] Los tags muestran el color y el punto exactos: LOGRO verde, ACTIVIDAD azul, ANUNCIO índigo.
- [x] El post de actividad muestra el bloque de foto placeholder (borde punteado `#DBCDBA`, alto 200px).
- [x] El ítem activo del sidebar corresponde a la ruta actual.
- [x] Por debajo de 768px el sidebar se oculta, aparece el top bar y el botón hamburguesa abre/cierra el menú.
- [x] Las 7 rutas placeholder responden 200 y muestran el placeholder visual.
- [x] `/login` no muestra el sidebar.
- [x] `lang="es"` y el `<title>` es "OpenDayCare".

## Decisions

- **Sí:** Tailwind 4 + tokens `@theme inline`. Es la convención del proyecto y mantiene el look exacto.
- **No:** CSS Modules / estilos inline literales. Rompería la convención de Tailwind.
- **Sí:** SVG inline como componentes. Cero dependencias y trazo idéntico al mockup.
- **No:** librería de iconos (lucide). Puede variar el trazo exacto.
- **Sí:** route group `(app)` para el shell y `(auth)` para login sin sidebar.
- **Sí:** `<link>` de Google Fonts. Elección del usuario frente a `next/font`.
- **Sí:** responsive real con drawer. Se añade sin alterar los valores de escritorio.
- **No:** auth y DB. No existen todavía; este spec es sólo UI.

## Risks

| Risk | Mitigation |
| --- | --- |
| FOUT por `<link>` a Google Fonts | `preconnect` + fallback `system-ui` en los tokens |
| El responsive desvía el look de escritorio | No tocar valores desktop; validar por screenshot a 1280px |
| Borrar `app/page.tsx` deja imports muertos (Geist) | Reescribir `layout.tsx` en el mismo paso |

## What is **not** in this spec

- Autenticación funcional y sesiones.
- Base de datos y persistencia.
- Lógica real de crear/editar publicaciones, niños, avisos o detalle.
- Contenido dinámico o fetch.

Cada uno, si llega, va en su propio spec.
