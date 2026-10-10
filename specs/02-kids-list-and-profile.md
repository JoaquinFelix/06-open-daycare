# SPEC 02 — Lista y perfil de niños fieles a los mockups

> **Status:** Approved
> **Depends on:** SPEC 01
> **Date:** 2026-10-10
> **Objective:** Replicar `references/pantallas/ninos.dc.html` en `/kids` y `references/pantallas/perfil-nino.dc.html` en `/kids/[id]` con datos mock por niño, búsqueda en cliente y rutas placeholder para las pantallas fuera de alcance.

## Scope

**In:**

- `/kids`: encabezado "GESTIÓN / Niños" con botón "Agregar niño", buscador, rótulo "SALA SOLES · 8 niños" y grilla de 2 columnas con las 8 tarjetas del mockup.
- `/kids/[id]`: perfil con "Volver a Niños", avatar 84px, nombre, edad/sala, "Editar", bloque "Alergias y notas", ficha (nacimiento, sala, ingreso), botón "Resumen del día" y tarjeta "PADRES VINCULADOS".
- Buscador que filtra por nombre en cliente (`useState`), case-insensitive, con estado vacío.
- Datos mock por niño en `data/children.ts`; cada tarjeta enlaza a su perfil.
- Prerender estático de los 8 perfiles con `generateStaticParams`; `notFound()` para id inexistente.
- Ruta placeholder `/kids/new` (Agregar niño y Editar), `/kids/[id]/summary` (Resumen del día), `/kids/[id]/link-parent` (Vincular otro padre), reusando `PlaceholderPage`. "Cerrar sesión" sigue apuntando a `/login`.
- Ampliar `components/ui/icons.tsx` con `search`, `chevron-left`, `chevron-right` y `alert`.
- Responsive como SPEC 01: grilla 2→1 columna en móvil; perfil en columnas apiladas. Sin alterar valores de escritorio (validado a 1280px).

**Out of scope (for future specs):**

- Alta/edición real de niños, vinculación real de padres, resumen diario real.
- Persistencia, base de datos, fetch o auth.
- Formularios y validaciones.

## Data model

Contenido mock tipado, sin persistencia.

```ts
// data/children.ts
export type KidBadge = { label: string; variant: "allergy" | "link" };

export type Parent = {
  name: string;
  relation: string;      // "Mamá" | "Papá"
  statusLabel: string;   // "activa" | "invitación enviada"
  status: "active" | "pending";
  initial: string;
  avatarBg: string;      // color del círculo
};

export type Kid = {
  id: string;            // "mateo" → /kids/mateo
  name: string;
  initial: string;
  ageLabel: string;      // "3 años"
  parentsLabel: string;  // "2 padres vinculados" | "sin padres vinculados"
  avatarBg: string;      // #A9D9E8 ...
  avatarFg: string;      // #1F7A93 ...
  badge?: KidBadge;      // MANÍ / LACTOSA (allergy) | VINCULAR (link)
  profile: {
    birthDate: string;   // "12 mar 2022"
    room: string;        // "Soles"
    joinedAt: string;    // "feb 2025"
    allergyLabel?: string;  // "MANÍ"
    allergyNote?: string;   // "Alergia al maní. Evitar frutos secos…"
    parents: Parent[];
  };
};

export const kids: Kid[] = [/* 8 niños del mockup */];
export function getKid(id: string): Kid | undefined;
```

Valores exactos del mockup (lista):

| id | inicial | avatar bg/fg | subtítulo | badge |
| --- | --- | --- | --- | --- |
| mateo | M | `#A9D9E8` / `#1F7A93` | 3 años · 2 padres vinculados | MANÍ |
| sofia | S | `#F4B8CC` / `#C44A7A` | 2 años · 1 padre vinculado | — |
| benjamin | B | `#B9DEC4` / `#3E8B62` | 3 años · 2 padres vinculados | — |
| valentina | V | `#F4DC8E` / `#9A7B1E` | 2 años · sin padres vinculados | VINCULAR |
| tomas | T | `#C9B6E8` / `#7B5FC0` | 3 años · 1 padre vinculado | LACTOSA |
| emma | E | `#F4B8CC` / `#C44A7A` | 2 años · 1 padre vinculado | — |
| lucas | L | `#A9D9E8` / `#1F7A93` | 3 años · 1 padre vinculado | — |
| olivia | O | `#B9DEC4` / `#3E8B62` | 2 años · 1 padre vinculado | — |

Pills: allergy `#FBD8CC`/`#D9684A`; link `#F9D2DE`/`#C56486`. Chevron `#CBB89F`.

Perfil de Mateo (mockup) como semilla: nacimiento "12 mar 2022", sala "Soles", ingreso "feb 2025", nota "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.", padres Lucía Fernández (Mamá · activa, ACTIVA `#CFEBD8`/`#3E9B6C`, avatar `#C9B6E8`) y Diego Fernández (Papá · invitación enviada, PENDIENTE `#F7E7A6`/`#9A7B1E`, avatar `#A9C7E8`). El resto se completa con valores mock coherentes con `ageLabel`/`parentsLabel`.

`data/nav.ts`: cambiar el ítem "Niños" a `href: "/kids"`.

No se agregan tokens nuevos: los colores de avatar/pill van inline como en `PostCard`, siguiendo la convención de SPEC 01.

## Implementation plan

1. Crear `data/children.ts` (tipos, 8 niños, `getKid`). Actualizar `data/nav.ts`: Niños → `/kids`. Verificar: `npx tsc --noEmit`.
2. Ampliar `IconName` y `components/ui/icons.tsx` con `search`, `chevron-left`, `chevron-right`, `alert` (paths exactos del mockup).
3. Crear `components/kids/KidsHeader.tsx` y `components/kids/KidCard.tsx`.
4. Crear `components/kids/KidsSearch.tsx` (`"use client"`, `useState`): buscador + rótulo "SALA SOLES · N niños" + grilla; filtra `kids` por nombre.
5. Mover la ruta: borrar `app/(app)/ninos/` y crear `app/(app)/kids/page.tsx` que renderiza `KidsHeader` + `KidsSearch`.
6. Crear componentes de perfil: `KidProfileHeader.tsx`, `AllergyNotice.tsx`, `KidInfoCard.tsx`, `LinkedParentsCard.tsx`.
7. Crear `app/(app)/kids/[id]/page.tsx`: `generateStaticParams()` desde `kids`, `const { id } = await params`, `getKid(id)` o `notFound()`, `generateMetadata` con el nombre.
8. Crear placeholders en `app/(app)/kids/new/page.tsx`, `app/(app)/kids/[id]/summary/page.tsx` y `app/(app)/kids/[id]/link-parent/page.tsx` (con `generateStaticParams` los dos últimos), reusando `PlaceholderPage`.
9. Verificar: `npm run build`, `npx tsc --noEmit`, `npx eslint app components data`, y comparación por screenshot con Playwright a 1280px contra `ninos.dc.html` y `perfil-nino.dc.html`.

## Acceptance criteria

- [ ] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [ ] `npx eslint app components data` pasa sin errores.
- [ ] `/kids` muestra "GESTIÓN", "Niños", el botón "Agregar niño", el buscador, "SALA SOLES · 8 niños" y las 8 tarjetas en grilla de 2 columnas.
- [ ] Cada tarjeta muestra avatar (color e inicial exactos), nombre, subtítulo y badge o chevron según la tabla.
- [ ] Escribir en el buscador filtra las tarjetas por nombre en cliente; sin coincidencias muestra un estado vacío.
- [ ] Clic en una tarjeta navega a `/kids/<id>`.
- [ ] `/kids/mateo` renderiza "Volver a Niños", avatar 84px, "Mateo Fernández", "3 años · Sala Soles", "Editar", el bloque de alergias, la ficha (12 mar 2022 / Soles / feb 2025), "Resumen del día" y los padres Lucía (ACTIVA) y Diego (PENDIENTE).
- [ ] Los 8 perfiles se prerenderizan estáticamente; un id inexistente devuelve 404.
- [ ] El ítem "Niños" del sidebar aparece activo en `/kids` y `/kids/[id]`.
- [ ] `/kids/new`, `/kids/mateo/summary` y `/kids/mateo/link-parent` responden 200 con el placeholder visual.
- [ ] "Cerrar sesión" apunta a `/login`.
- [ ] Por debajo de 768px la grilla pasa a 1 columna y el perfil apila columnas, sin alterar el layout a 1280px.
- [ ] Los screenshots a 1280px coinciden con `references/pantallas/ninos.dc.html` y `perfil-nino.dc.html`.

## Decisions

- **Sí:** rutas en inglés `/kids` (decisión del usuario), en lugar de `/ninos`.
- **Sí:** el placeholder `/ninos` de SPEC 01 se elimina y se reemplaza por `/kids`; `data/nav.ts` se actualiza. Cambio deliberado del entregable de SPEC 01.
- **Sí:** `generateStaticParams` para prerenderizar los 8 perfiles. Con `cacheComponents: true`, sin él `params` es runtime data y exigiría `<Suspense>`.
- **Sí:** datos mock por niño en `data/children.ts`, render dinámico por id. Cada perfil muestra su propia información.
- **Sí:** búsqueda cliente con `useState`. Sin servidor ni datos reales.
- **Sí:** ampliar `Icon` con 4 iconos inline. Mantiene la convención de SPEC 01 y el trazo exacto.
- **Sí:** los enlaces fuera de alcance reusan `PlaceholderPage`. Nada da 404.
- **No:** librería de iconos, CSS Modules, base de datos o auth.

## Risks

| Risk | Mitigation |
| --- | --- |
| `cacheComponents` + segmento dinámico rompe el prerender | `generateStaticParams` con los 8 ids + `await params` |
| `/kids/new` compite con `/kids/[id]` | Next prioriza el segmento estático; los ids son slugs (`mateo`), nunca `new` |
| Botones nuevos no existen en `ICONS` | Agregar `search`, `chevron-left`, `chevron-right`, `alert` en el paso 2 |
| El responsive desvía el look de escritorio | No tocar valores desktop; validar por screenshot a 1280px |
| La ruta `/ninos` deja `navItems` y archivos huérfanos | Mover carpeta y actualizar `nav.ts` en el mismo paso |

## What is **not** in this spec

- Alta/edición real, vinculación real de padres y resumen del día funcional.
- Persistencia, base de datos, fetch y autenticación.

Cada uno, si llega, va en su propio spec.
