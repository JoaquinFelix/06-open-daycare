# SPEC 05 — Overlay "Vincular padre" desde el perfil del niño

> **Status:** Approved
> **Depends on:** SPEC 02, SPEC 04
> **Date:** 2026-10-13
> **Objective:** Replicar `references/pantallas/vincular-padre.dc.html` en `/kids/[id]/link-parent` como superposición (overlay) lanzada desde el botón "Vincular otro padre" del perfil, con validación de nombre y email, un código de invitación aleatorio de 5 caracteres y el alta del padre en estado PENDIENTE (memoria) al enviar.

## Scope

**In:**

- `/kids/[id]/link-parent` deja de ser un `PlaceholderPage` y pasa a renderizar el overlay con la tarjeta del mockup (max-width 480px).
- Intercepting route `app/(app)/@modal/(.)kids/[id]/link-parent/page.tsx`: al abrir desde el botón "Vincular otro padre" del perfil, el overlay aparece sobre el perfil (la URL cambia a `/kids/[id]/link-parent`); al cargar esa URL directo también responde 200 con el overlay. Mismo patrón que ya existe para `/kids/new`.
- Tarjeta fiel al mockup: header con "Vincular padre", subtítulo "a {nombre del niño}" y botón X; banner informativo; campos NOMBRE DEL PADRE/MADRE y EMAIL; pills de PARENTESCO (Mamá / Papá / Tutor/a, con "Mamá" seleccionada por defecto); recuadro punteado CÓDIGO DE INVITACIÓN con el código y "Vence en 7 días"; botón "Enviar invitación".
- Código de invitación aleatorio de 5 caracteres `[A-Z0-9]`, generado al abrir el overlay.
- Validación en cliente y re-validación en servidor: NOMBRE y EMAIL obligatorios; EMAIL con formato válido. Escribir en un campo limpia su error. Con errores no se navega.
- Server Action `sendParentInvite` que agrega el padre al niño en estado PENDIENTE, revalida y redirige al perfil `/kids/[id]`.
- `addParent` en `data/children.ts` que además actualiza `parentsLabel` del niño y le quita el badge `VINCULAR` cuando pasa a tener al menos un padre.
- Nuevos iconos `send` e `info` en `data/nav.ts` (`IconName`) y `components/ui/icons.tsx`.
- Generalizar `KidNewModalShell` → `KidModalShell` con prop `maxWidth` (default 520px; link-parent usa 480px).
- `metadata` propia en la ruta real.
- Responsive igual que el resto: la tarjeta no supera el ancho disponible en móvil.

**Out of scope (for future specs):**

- Envío real de correo y verificación del código de invitación.
- Edición, desvinculación o reenvío de invitaciones de padres existentes.
- Persistencia real: el padre vive en memoria del proceso servidor (se pierde al reiniciar).
- Vencimiento real a 7 días: "Vence en 7 días" es texto estático.
- Feed / auth del lado de la familia (`familia-feed.dc.html`), notificaciones y permisos del padre.
- Edición del niño o de sus notas médicas desde el perfil.

## Data model

No se modifican los tipos existentes. `Parent` no cambia (no incorpora email: no hay campo ni uso). Se agregan tipos y una función de alta.

```ts
// data/children.ts (ampliación)
export const PARENT_RELATIONS = ["Mamá", "Papá", "Tutor/a"] as const;
export type ParentRelation = (typeof PARENT_RELATIONS)[number];

export type NewParentInput = {
  kidId: string; // "mateo" — debe existir en getAllKids()
  name: string;  // "Diego Fernández" — obligatorio, sin espacios sobrantes
  email: string; // "correo@ejemplo.com" — obligatorio, con formato válido
  relation: ParentRelation; // obligatorio, uno de PARENT_RELATIONS
};

// Paleta de avatares de padres, rotada por cantidad de padres del niño.
const PARENT_AVATAR_COLORS: readonly string[] = [
  "#C9B6E8",
  "#A9C7E8",
  "#F2937A",
  "#B9DEC4",
];

export function addParent(input: NewParentInput): Parent | undefined;
```

Comportamiento de `addParent` (determinista):

- Busca el niño con `getKid(input.kidId)`; si no existe, devuelve `undefined`.
- Construye el `Parent`:
  - `name`: `input.name.trim().replace(/\s+/g, " ")`.
  - `relation`: `input.relation`.
  - `status`: `"pending"` y `statusLabel`: `"invitación enviada"`.
  - `initial`: primera letra del nombre en mayúscula.
  - `avatarBg`: `PARENT_AVATAR_COLORS[padres_actuales % PARENT_AVATAR_COLORS.length]`.
- Hace push en `kid.profile.parents`.
- Recalcula `kid.parentsLabel`: `"sin padres vinculados"` | `"1 padre vinculado"` | `"N padres vinculados"`.
- Si el niño tiene `badge` con `variant: "link"` (VINCULAR) y ya tiene ≥1 padre, elimina ese badge.

```ts
// lib/parent-invite.ts (nuevo)
export const INVITE_CODE_LENGTH = 5;

// Solo para re-validar el email en cliente y servidor; no pretende ser RFC completo.
export function isValidEmail(value: string): boolean;

// Código de invitación de 5 caracteres [A-Z0-9], generado al abrir el overlay.
export function randomInviteCode(): string;
```

Estado de cliente del formulario:

```ts
// components/kids/LinkParentForm.tsx
type LinkParentValues = {
  name: string;
  email: string;
  relation: ParentRelation; // arranca en PARENT_RELATIONS[0] ("Mamá")
};
type LinkParentErrors = Partial<Record<"name" | "email", string>>;
```

Convenciones:

- El error se evalúa en el submit y se limpia en cada `onChange` del campo (igual que SPEC 03 y SPEC 04).
- El código se genera en un `useEffect` (una sola vez, ya hidratado) para no fijarlo en el prerender ni provocar hydration mismatch.

Colores del mockup usados inline (sin tokens nuevos en `app/globals.css`):

| Uso | Valor |
| --- | --- |
| Tarjeta | `#FBF4EC`, borde `#ECE0D0`, radio 24px |
| Banner informativo | fondo `#E3ECFB`, texto `#3F5694`, icono `#4E72C8` |
| Borde de inputs | `#EADFD0` |
| Borde de error / texto de error | `#C5503A` (token `primary-deep`) |
| Pill de parentesco seleccionada | fondo `#CCD8F4`, borde `#9FB8EC`, texto `#4E72C8` |
| Pill sin seleccionar | fondo `#FFFDF9`, borde `#ECE0D0`, texto `#6E6359` |
| Recuadro del código | fondo `#FBF1D6`, borde punteado `#E6D08A`, código `#8A7234`, rótulo `#A88526` |
| Botón "Enviar invitación" | gradiente `#F4977E` → `#EE8164` |

## Implementation plan

> **Regla de avance:** al terminar cada paso, el agente publica un resumen breve de lo hecho (archivos creados/editados, qué quedó funcionando y qué verificó) y **espera la confirmación del usuario** antes de arrancar el siguiente paso. No se ejecutan dos pasos consecutivos sin esa confirmación.

1. Ampliar `IconName` en `data/nav.ts` con `"send"` e `"info"`, y agregar sus paths en `components/ui/icons.tsx` (send: `m22 2-7 20-4-9-9-4z` + `M22 2 11 13`; info: `<circle cx="12" cy="12" r="10"/>` + `M12 16v-4M12 8h.01`). Verificar: `npx tsc --noEmit`.
2. Generalizar `components/kids/KidNewModalShell.tsx` → `components/kids/KidModalShell.tsx` con prop `maxWidth?: number` (default 520) e inline style. Actualizar los usos en `app/(app)/kids/new/page.tsx` y `app/(app)/@modal/(.)kids/new/page.tsx`. Verificar: `npm run dev`, `/kids/new` sigue mostrando la tarjeta de 520px.
3. Ampliar `data/children.ts`: `PARENT_RELATIONS`, `ParentRelation`, `NewParentInput`, `PARENT_AVATAR_COLORS` y `addParent()`. Verificar: `npx tsc --noEmit`.
4. Crear `lib/parent-invite.ts` con `INVITE_CODE_LENGTH`, `isValidEmail()` y `randomInviteCode()`. Verificar: `npx tsc --noEmit`.
5. Crear `components/kids/LinkParentForm.tsx` (`"use client"`): header con X, banner, los dos inputs, pills de parentesco, recuadro del código (generado en `useEffect`), estado de errores, validación en submit y botón "Enviar invitación". Recibe `action`, `kidId`, `kidName` y `kidFirstName`. Verificar: `npx tsc --noEmit`.
6. Crear `app/(app)/kids/[id]/link-parent/actions.ts` con `"use server"` y `sendParentInvite(formData)`: lee y re-valida (`kidId` existente, nombre y email no vacíos, `isValidEmail`, `relation` ∈ `PARENT_RELATIONS`); con datos inválidos redirige a `/kids/[id]/link-parent`; con datos válidos llama `addParent()`, `revalidatePath("/kids")`, `revalidatePath(\`/kids/${kidId}\`)` y `redirect(\`/kids/${kidId}\`)` (redirect fuera de try/catch). Verificar: `npx tsc --noEmit`.
7. Reemplazar `app/(app)/kids/[id]/link-parent/page.tsx`: quitar `PlaceholderPage`, `getKid(id)` o `notFound()`, `metadata = { title: "Vincular padre · OpenDayCare" }` y renderizar `KidModalShell` (maxWidth 480) + `LinkParentForm`. Verificar: `npm run dev`, `/kids/mateo/link-parent` directo muestra el overlay.
8. Crear `app/(app)/@modal/(.)kids/[id]/link-parent/page.tsx` con el mismo contenido que el paso 7 (importando el componente compartido si conviene) para interceptar la navegación desde el perfil. Verificar: desde `/kids/mateo`, el botón "Vincular otro padre" abre el overlay sobre el perfil y la URL cambia.
9. Verificación completa: `npm run build`, `npx tsc --noEmit`, `npx eslint app components data lib`, y con Playwright en `npm run dev`: apertura desde el perfil, validaciones, envío con datos válidos → padre PENDIENTE en el perfil, cierre con X sin cambios, carga directa de la URL, 404 con id inexistente, `/kids/new` sin regresiones y comparación por screenshot a 1280px contra `vincular-padre.dc.html`.

## Acceptance criteria

- [ ] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [ ] `npx eslint app components data lib` pasa sin errores.
- [ ] Desde `/kids/mateo`, clic en "Vincular otro padre" abre el overlay sobre el perfil con la tarjeta de 480px y la URL pasa a `/kids/mateo/link-parent`.
- [ ] El overlay muestra "Vincular padre", "a Mateo Fernández", el botón X, el banner "Solo verá el feed de Mateo.", NOMBRE DEL PADRE/MADRE, EMAIL, PARENTESCO, CÓDIGO DE INVITACIÓN, "Vence en 7 días" y el botón "Enviar invitación".
- [ ] El código mostrado coincide con `^[A-Z0-9]{5}$` y no es el valor fijo `7K4P9`; al reabrir el overlay se genera un código nuevo.
- [ ] "Mamá" aparece seleccionada por defecto; clic en "Papá" o "Tutor/a" mueve la selección (queda una sola pill activa).
- [ ] Enviar con NOMBRE vacío muestra "Este campo es obligatorio." con borde `#C5503A` y no navega; escribir en el campo limpia el error.
- [ ] Enviar con EMAIL vacío muestra "Este campo es obligatorio."; con email inválido (`"abc"`, `"a@"`) muestra "Ingresá un email válido." y no navega.
- [ ] Con nombre y email válidos, "Enviar invitación" navega a `/kids/mateo` y la tarjeta "PADRES VINCULADOS" muestra el nuevo padre con su relación, "invitación enviada" y pill PENDIENTE.
- [ ] El rótulo del niño en `/kids` refleja el nuevo conteo (`"1 padre vinculado"` / `"N padres vinculados"`) y Valentina pierde el badge `VINCULAR` tras vincular un padre.
- [ ] La X cierra el overlay y vuelve al perfil sin agregar ni modificar nada.
- [ ] Cargar directo `/kids/mateo/link-parent` responde 200 con el overlay; `/kids/nope/link-parent` devuelve 404.
- [ ] `/kids/new` sigue abriendo su overlay de 520px sin regresiones.
- [ ] A 1280px el overlay coincide con `references/pantallas/vincular-padre.dc.html`.
- [ ] `references/` no fue modificado.

## Decisions

- **Sí:** intercepting route `@modal/(.)kids/[id]/link-parent` + ruta real, mismo patrón que `/kids/new` (decisión del usuario). La navegación desde el perfil muestra el overlay sobre el perfil y la carga directa de la URL también funciona.
- **Sí:** `addParent` sobre el store en memoria con el padre en estado PENDIENTE (decisión del usuario), consistente con el alta de niño de SPEC 04. El perfil muestra el nuevo padre al revalidar.
- **Sí:** código de invitación aleatorio de 5 caracteres (decisión del usuario), generado en cliente en `useEffect` para no fijarlo en el prerender ni arriesgar hydration mismatch.
- **Sí:** validar formato de email además de los obligatorios (decisión del usuario), con mensaje propio "Ingresá un email válido."; SPEC 03 no validaba formato y aquí sí.
- **Sí:** PARENTESCO con "Mamá" por defecto y sin validación: siempre tiene un valor.
- **Sí:** generalizar `KidNewModalShell` → `KidModalShell` con `maxWidth` en vez de duplicar el shell; se mantiene DRY y se conserva el aspecto de `/kids/new`.
- **Sí:** actualizar `parentsLabel` y quitar el badge `VINCULAR` al vincular el primer padre, para no dejar el listado incoherente con el perfil.
- **Sí:** mensajes de error reutilizando `components/auth/FieldError.tsx` (ya acepta `message?`).
- **No:** persistir el email del padre. `Parent` no cambia y el email no se muestra; sólo se valida.
- **No:** envío real de correo ni verificación del código de invitación: no hay backend.
- **No:** `useActionState` para errores del servidor: la validación de cliente cubre los mensajes y el servidor re-valida y redirige (defensa en profundidad, igual que SPEC 04).
- **No:** crear un segundo layout `@modal` o tocar el `modal` slot existente: el slot y su `default.tsx` ya sirven.

## Risks

| Risk | Mitigation |
| --- | --- |
| El intercepting route con segmento dinámico `[id]` no matchea por `cacheComponents` | Verificar con Playwright la apertura desde el perfil y la carga directa; si no matchea, ajustar la estructura del `@modal` |
| El código aleatorio en render inicial provoca hydration mismatch | Generarlo en `useEffect` (post-hidratación), nunca en el render del servidor |
| `revalidatePath` sobre mutaciones en memoria de objetos `const` del seed | Revalidar `/kids` y `/kids/[id]`; verificar end-to-end en `npm run dev` |
| El perfil es estático (`generateStaticParams`) y podría no reflejar el padre nuevo | Ya declara `instant = false`; probar perfil y listado tras enviar |
| `ParentRow` usa `key={parent.name}`: dos padres homónimos colisionan como key de React | No bloquea el flujo mock; documentado, se puede pasar la key a `name` + `relation` si molesta |
| `KidNewModalShell` se usa en dos lugares y el rename puede romper uno | Hacer el rename y actualizar ambos usos en el mismo paso (2), verificando `/kids/new` |

## What is **not** in this spec

- Envío real de correo y verificación del código.
- Edición/desvinculación de padres y reenvío de invitaciones.
- Persistencia más allá del proceso servidor, API o base de datos.
- Vencimiento real del código y feed/auth del lado de la familia.

Cada uno, si llega, va en su propio spec.
