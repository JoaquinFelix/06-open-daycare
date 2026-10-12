# SPEC 04 — Modal "Agregar niño" desde /kids

> **Status:** Implemented
> **Depends on:** SPEC 02
> **Date:** 2026-10-12
> **Objective:** Replicar `references/pantallas/agregar-nino.dc.html` en `/kids/new` como ventana modal (ruta mantenida, abierta desde el botón "+ Agregar niño" de `/kids`), con campos obligatorios (nombre completo, fecha de nacimiento con máscara `dd/mm/aaaa` y sala de 3 opciones), que al guardar crea el niño, regresa a `/kids` y refresca la lista agrupada por sala; "Cancelar" no hace ningún cambio.

## Scope

**In:**

- `/kids/new` reemplaza el `PlaceholderPage` por la pantalla modal del mockup: fondo tenue con la tarjeta centrada (max-width 520px), header con "Cancelar" (a la izquierda), título "Agregar niño" y "Guardar" (a la derecha, botón de submit).
- Formulario con los 5 campos del mockup: NOMBRE COMPLETO, FECHA DE NACIMIENTO, SALA, ALERGIAS (ETIQUETAS) y NOTAS MÉDICAS, con el mismo estilo (labels 12px/800 tracking .7px `#94887B`, inputs 14px radius, borde 1.5px `#EADFD0`).
- Obligatorios: NOMBRE COMPLETO, FECHA DE NACIMIENTO y SALA. Validación al enviar: borde del campo en `#C5503A` y mensaje inline bajo el campo ("Este campo es obligatorio." / "Ingresá una fecha válida y no futura."); escribir en el campo limpia su error; si hay errores, no se navega.
- Máscara de FECHA DE NACIMIENTO: formato `dd/mm/aaaa` aplicada mientras se escribe (solo dígitos, barra automática en posiciones 2 y 5, máximo 8 dígitos). Se valida formato, fecha real y que no sea futura.
- SALA como `<select>` nativo estilizado como el bloque del mockup (valor por defecto "Soles" + chevron `chevron-down`), con las 3 salas fijas: Soles, Jardines y Valles.
- ALERGIAS (texto libre, opcional) y NOTAS MÉDICAS (textarea opcional) sin validación.
- Server Action `createChild` que re-valida en servidor, crea el niño en el mock en memoria, ejecuta `revalidatePath("/kids")` y `redirect("/kids")`.
- `/kids` pasa a agrupar la grilla por sala: un rótulo "SALA X · N niños" por sala con su grilla (2 columnas desktop), en orden Soles → Jardines → Valles, mostrando solo las salas con niños. El buscador filtra por nombre en todas las salas; sin coincidencias muestra el estado vacío existente.
- La tarjeta de un niño recién creado enlaza a su perfil `/kids/<id>`, que se renderiza bajo demanda (no está en `generateStaticParams`).
- Nuevo icono `chevron-down` en `components/ui/icons.tsx` para el select.
- `metadata` propia en `/kids/new`.

**Out of scope (for future specs):**

- Edición o borrado de un niño existente.
- Persistencia real: el alta vive en memoria del proceso servidor (se pierde al reiniciar el server o cambiar de proceso). Base de datos, API o fetch quedan fuera.
- Gestión (alta/baja) de salas: la lista `ROOMS` es fija en código.
- Vinculación de padres desde el alta (un niño creado nace "sin padres vinculados" con badge `VINCULAR`).
- Edad/sala según fecha futura o cálculo de vigencia; la edad se calcula al momento del alta.
- Validar que la fecha no sea anterior a un mínimo razonable (sólo se bloquea el futuro).

## Data model

Se agrega un módulo de salas y funciones de alto sobre el mock existente. `Kid` no cambia.

```ts
// data/rooms.ts (nuevo)
export const ROOMS = ["Soles", "Jardines", "Valles"] as const;
export type Room = (typeof ROOMS)[number];
```

```ts
// data/children.ts (ampliación)
import type { Room } from "@/data/rooms";

export type NewKidInput = {
  name: string;         // "Martina López" — obligatorio, sin espacios sobrantes
  birthDate: string;    // "dd/mm/aaaa" — obligatorio, fecha real y no futura
  room: Room;           // obligatorio, uno de ROOMS
  allergies?: string;   // "Maní, Lactosa" — opcional
  notes?: string;       // "Indicaciones, medicación…" — opcional
};

// Store en memoria (sobrevive a las requests, no a reinicios).
const createdKids: Kid[] = [];

export function getAllKids(): Kid[];                 // [...kids, ...createdKids]
export function kidsByRoom(): { room: Room; kids: Kid[] }[]; // solo salas con ≥1 niño, orden ROOMS
export function addChild(input: NewKidInput): Kid;   // deriva campos y pushea en createdKids
export function getKid(id: string): Kid | undefined; // pasa a buscar en getAllKids()
```

Campos derivados al crear (todos deterministas):

- `id`: slug del nombre en minúsculas, sin acentos, no alfanuméricos → `-` (`"Martina López"` → `"martina-lopez"`); si colisiona, sufijo `-2`, `-3`, … El slug `"new"` se fuerza a `"nuevo"` para no pisar la ruta.
- `initial`: primera letra del primer nombre, mayúscula.
- `ageLabel`: `"N años"` / `"1 año"` calculado desde `birthDate` respecto a hoy.
- `parentsLabel`: `"sin padres vinculados"`.
- `avatarBg` / `avatarFg`: se rotan los 3 pares existentes (`#A9D9E8/#1F7A93`, `#F4B8CC/#C44A7A`, `#B9DEC4/#3E8B62`) por índice de `createdKids.length % 3`.
- `badge`: solo si hay alergias → `{ label: primera alergia en mayúsculas, variant: "allergy" }`.
- `profile`: `birthDate` formateado `"dd mmm yyyy"` (`"12 mar 2022"`, meses `ene feb mar abr may jun jul ago sep oct nov dic`), `room`, `joinedAt` `"oct 2026"` (mes/año actuales), `allergyLabel` primera alergia en mayúsculas, `allergyNote` = `notes` si existe, `parents: []`.

```ts
// components/kids/KidsList.tsx (estado de cliente, antes "KidsSearch")
type KidsListState = {
  query: string; // busca en todas las salas
};
```

No se persiste nada fuera del proceso servidor y no hay tokens de diseño nuevos: los colores van inline como en `KidCard`.

## Implementation plan

> **Regla de avance:** al terminar cada paso, el agente publica un resumen breve de lo hecho (archivos creados/editados, qué quedó funcionando y qué verificó) y **espera la confirmación del usuario** antes de arrancar el siguiente paso. No se ejecutan dos pasos consecutivos sin esa confirmación.

1. Crear `data/rooms.ts` (`ROOMS`, `Room`). Verificar: `npx tsc --noEmit`.
2. Ampliar `data/children.ts`: `NewKidInput`, `createdKids`, `getAllKids()`, `kidsByRoom()`, `addChild()`, y `getKid()` sobre `getAllKids()`. Verificar: `npx tsc --noEmit` (los puntos que hoy usan `kids` siguen compilando; `generateStaticParams` sigue usando el seed).
3. Refactorizar `components/kids/KidsSearch.tsx` → `components/kids/KidsList.tsx` (cliente): recibe `items: Kid[]`, mantiene el buscador, agrupa por sala en orden `ROOMS` (solo salas con resultados), renderiza un rótulo "SALA X · N niños" + grilla por sala y reusa el estado vacío. Actualizar `app/(app)/kids/page.tsx` a `async`, leer `getAllKids()` en servidor y pasarlo como `items`. Verificar: `npm run dev`, `/kids` muestra 8 niños agrupados en SALA SOLES.
4. Agregar `chevron-down` a `components/ui/icons.tsx` y extender `components/auth/FieldError.tsx` con `message?: string` (default: "Este campo es obligatorio.") sin romper los usos de SPEC 03.
5. Crear `lib/child-form.ts` con helpers puros compartidos cliente/servidor: `maskDate(value)` (máscara `dd/mm/aaaa`), `parseDate(value)` (`Date | null`), `isFutureDate(date)`, `formatBirthDate(date)` (`"dd mmm yyyy"`), `ageLabelFrom(date)` y `slugifyName(name)`. Verificar: `npx tsc --noEmit`.
6. Crear `components/kids/AddChildForm.tsx` (cliente): estado de los 5 campos + errores por campo, máscara en el input de fecha, `<select>` de salas, submit que valida en cliente y, si no hay errores, envía el Server Action. Botón "Cancelar" como `Link` a `/kids`.
7. Crear `app/(app)/kids/new/actions.ts` con `"use server"` y `createChild(formData: FormData)`: re-valida (obligatorios, formato/fecha no futura, `room` ∈ `ROOMS`), llama `addChild()`, luego `revalidatePath("/kids")` y `redirect("/kids")` **fuera** de cualquier `try/catch`.
8. Reemplazar `app/(app)/kids/new/page.tsx`: quitar `PlaceholderPage`, renderizar el overlay `fixed inset-0` con la tarjeta del mockup + `AddChildForm`, y `export const metadata = { title: "Agregar niño · OpenDayCare" }`. Verificar: `npm run dev`, `/kids/new` luce como el mockup a 1280px.
9. Verificación completa: `npm run build`, `npx tsc --noEmit`, `npx eslint app components data lib`, y con Playwright en `npm run dev`: alta con validación (vacíos → errores inline; fecha futura → error; fecha válida + sala Jardines → guarda), regreso a `/kids` con el niño nuevo en su sección, "Cancelar" sin cambios, y navegación a `/kids/<id>` del niño nuevo.

## Acceptance criteria

- [x] `npm run build` y `npx tsc --noEmit` terminan sin errores.
- [x] `npx eslint app components data lib` pasa sin errores.
- [x] El botón "+ Agregar niño" de `/kids` navega a `/kids/new`, que muestra la tarjeta modal centrada (max-width 520px) con header "Cancelar" / "Agregar niño" / "Guardar", fiel a `agregar-nino.dc.html` a 1280px.
- [x] El formulario muestra NOMBRE COMPLETO, FECHA DE NACIMIENTO, SALA (select: Soles por defecto, Jardines, Valles), ALERGIAS (ETIQUETAS) y NOTAS MÉDICAS.
- [x] Enviar con nombre vacío muestra "Este campo es obligatorio." bajo el campo con borde `#C5503A` y no navega; escribir limpia el error.
- [x] Enviar con fecha vacía muestra el error de obligatorio; con fecha mal formada (`"12/13/4500"`, `"31/02/2020"`) o futura (`"01/01/2099"`) muestra "Ingresá una fecha válida y no futura." bajo el campo y no navega.
- [x] El campo de fecha aplica la máscara mientras se escribe: `"1"` → `"1/"`, `"120320"` → `"12/03/20"`, y no acepta más de 8 dígitos.
- [x] Enviar con sala vacía (select en blanco forzado) muestra el error de obligatorio.
- [x] Con los 3 campos obligatorios válidos, "Guardar" crea el niño, navega a `/kids` y la lista lo muestra en la sección de su sala (Soles / Jardines / Valles) sin recargar la página.
- [x] El contador del rótulo "SALA X · N niños" refleja el nuevo total de esa sala.
- [x] El niño creado muestra en la tarjeta su inicial, nombre, "edad · sin padres vinculados" y badge `VINCULAR`; si se escribieron alergias, badge de alergia con la primera alergia en mayúsculas.
- [x] Clic en la tarjeta del niño creado navega a `/kids/<id>` y el perfil renderiza sus datos (nacimiento en formato `dd mmm yyyy`, sala e ingreso del mes actual).
- [x] Al crear un segundo niño con el mismo nombre, el `id` recibe sufijo `-2` y ambas tarjetas navegan a perfiles distintos.
- [x] "Cancelar" (o el botón atrás del navegador) vuelve a `/kids` sin crear ni modificar nada.
- [x] Refrescar `/kids/new` en el navegador (hard reload) muestra el formulario vacío sin errores, y un hard reload de `/kids` mantiene los 8 niños seed si no se creó ninguno.
- [x] `references/` no fue modificado.

## Decisions

- **Sí:** mantener `/kids/new` como ruta real y abrirla con `Link` desde el botón "+" (decisión del usuario), en lugar de intercepting/parallel routes para modal sobre `/kids`. El modal se logra visualmente con overlay `fixed inset-0` + tarjeta, tal como el mockup la dibuja sobre fondo liso.
- **Sí:** errores inline por campo reusando `components/auth/FieldError.tsx` con `message?` opcional (consistente con SPEC 03, borde `#C5503A`).
- **Sí:** máscara `dd/mm/aaaa` en el input (solo dígitos + `/` automática) validando además fecha real y no futura, en cliente y servidor.
- **Sí:** salas fijas en `data/rooms.ts` (`["Soles", "Jardines", "Valles"]`), reutilizadas por el select y por el agrupado del listado.
- **Sí:** persistencia mock en memoria del servidor (`createdKids` en `data/children.ts`) + Server Action con `revalidatePath("/kids")` + `redirect("/kids")`. Consistente con el enfoque "sin base de datos" de SPEC 01/02 y con el App Router.
- **Sí:** `/kids` agrupa por sala (decisión del usuario), mostrando sólo las salas con niños y manteniendo el buscador global.
- **Sí:** la tarjeta del niño creado enlaza a su perfil (decisión del usuario); el perfil se renderiza bajo demanda aunque `generateStaticParams` sólo prerenderice el seed.
- **Sí:** el slug `"new"` se fuerza a `"nuevo"` para no chocar con la ruta `/kids/new`.
- **No:** `<select>` custom con popper: se usa el nativo estilizado (accesible, sin JS extra, idéntico visual al mockup).
- **No:** React `useActionState` para errores del servidor: la validación de cliente ya cubre los mensajes inline; el servidor re-valida y redirige (defensa en profundidad, sin UI duplicada).
- **No:** persistencia en `localStorage` o archivo: el alta es mock en memoria y el curso aún no tiene capa de datos.
- **No:** crear un layout `@modal` con intercepting routes para superponer el modal sobre la grilla: complejidad extra (slots + `default.tsx`) sin beneficio visible para el mockup.

## Risks

| Risk | Mitigation |
| --- | --- |
| `createdKids` vive en memoria: un reinicio del dev server o un rebuild la vacía | Documentado como alcance del mock; los criterios no exigen sobrevivir a reinicios |
| `/kids` es estática en build; `revalidatePath("/kids")` debe refrescar el listado | Verificar el alta end-to-end con Playwright en `npm run dev` antes de cerrar |
| HMR de Turbopack puede recargar el módulo y perder `createdKids` al editar `data/*` | Aceptar en dev; el criterio de "Cancelar sin cambios" no depende de esto |
| `cacheComponents: true` + segmento dinámico `/kids/[id]` para ids no prerenderizados | Mantener `export const instant = false` ya presente; probar `/kids/<id>` del niño creado |
| `/kids/[id]/summary` y `/kids/[id]/link-parent` sólo prerenderizan el seed | Con `dynamicParams` por defecto en `true` renderizan bajo demanda; fuera de alcance de este spec pero se deja probado que no rompen |
| Dos niños con el mismo nombre colisionan en `id` | Sufijo incremental `-2`, `-3`… verificado en criterio de aceptación |

## What is **not** in this spec

- Edición/borrado de niños, gestión de salas y vinculación de padres desde el alta.
- Persistencia más allá del proceso servidor, API o base de datos.

Cada uno, si llega, va en su propio spec.
