# SPEC 03 — Login y activación de cuenta

> **Status:** Approved
> **Depends on:** SPEC 01
> **Date:** 2026-10-12
> **Objective:** Replicar `references/pantallas/login.dc.html` en `/login` y `references/pantallas/activar-cuenta.dc.html` en `/activar-cuenta`, sin la sección de rol.

## Scope

**In:**

- `/login`: panel de marca a la izquierda (gradiente coral, círculos decorativos, logo "OpenDayCare", titular, párrafo y pie "🌿 Guardería Sala Soles") y formulario a la derecha.
- Formulario de login con "Iniciar sesión", "Ingresá para ver el día de hoy.", campo EMAIL precargado con `caro@opendaycare.com`, campo CONTRASEÑA, "¿Olvidaste tu contraseña?" y botón "Iniciar sesión".
- Pie "¿Te invitó la guardería? Activá tu cuenta" que navega a `/activar-cuenta`.
- `/activar-cuenta`: columna centrada de 440px con logo, "Bienvenida a OpenDayCare", párrafo, tarjeta de invitación (avatar "M", "Te invitaron a seguir a", "Mateo · Sala Soles"), los campos CÓDIGO DE INVITACIÓN (`7K4P9`), EMAIL (`lucia.fernandez@gmail.com`) y CREAR CONTRASEÑA, el checkbox de consentimiento marcado y el botón "Activar mi cuenta".
- Pie "¿Ya tenés cuenta? Iniciar sesión" que navega a `/login`.
- Validación básica de campos vacíos: al enviar, un campo de texto requerido vacío queda con borde `#C5503A` y muestra "Este campo es obligatorio." debajo. Escribir en el campo limpia su error. Si hay algún error, no se navega.
- Toggle de visibilidad de contraseña en los dos formularios, con los iconos nuevos `eye` y `eye-off`.
- Fondo `#FBF4EC` de pantalla completa en ambas pantallas, vía `app/(auth)/layout.tsx`.
- Responsive del login: por debajo de 768px el panel de marca se apila arriba y el formulario queda debajo; el párrafo "Publicá momentos, gestioná las salas y mantené a las familias cerca, desde un solo lugar." se oculta.
- `metadata` propia en las dos páginas.
- Reemplazar el `PlaceholderPage` de `/login` por la pantalla real.

**Out of scope (for future specs):**

- La sección "INGRESO COMO" con los botones Personal y Familia, y toda la lógica de rol asociada.
- Autenticación real, sesión, roles y permisos.
- Feed de familia (`familia-feed.dc.html`): no existe ruta; los destinos apuntan a `/`.
- Recuperación de contraseña ("¿Olvidaste tu contraseña?" queda como texto sin destino).
- Validación de formato de email, longitud de contraseña o fuerza de la contraseña.
- Registro sin invitación y verificación real del código de invitación.
- Almacenar o leer el consentimiento de fotos.

## Data model

No hay datos persistidos ni datos mock nuevos. Se introduce únicamente estado de cliente para los dos formularios:

```ts
// components/auth/LoginScreen.tsx
type LoginState = {
  email: string;          // "caro@opendaycare.com"
  password: string;       // arranca vacío
  showPassword: boolean;  // alterna type="password" | "text"
  errors: { email: boolean; password: boolean };
};

// components/auth/ActivateAccountScreen.tsx
type ActivateState = {
  code: string;           // "7K4P9"
  email: string;          // "lucia.fernandez@gmail.com"
  password: string;       // arranca vacío
  consent: boolean;       // arranca en true
  showPassword: boolean;
  errors: { code: boolean; email: boolean; password: boolean };
};
```

Convenciones:

- El error se evalúa en el submit y se limpia en cada `onChange` del campo.
- `consent` no participa de la validación: el checkbox nace marcado y solo controla su propio estado.

Colores de mockup usados inline (sin tokens nuevos en `app/globals.css`):

| Uso | Valor |
| --- | --- |
| Fondo de pantalla | `#FBF4EC` |
| Gradiente del panel de marca | `#F6A98E` → `#F2937A` → `#EC7E62` |
| Borde de inputs | `#EADFD0` |
| Borde de contraseña al enviar | `#F2A78E` |
| Borde y texto de error | `#C5503A` (token `primary-deep`) |
| Botón principal | `#F4977E` → `#EE8164` |
| Avatar de Mateo | fondo `#A9D9E8`, texto `#1F7A93` |
| Casilla de consentimiento | `#5FB97E` sobre `#FBF1D6`, texto `#8A7234` |

## Implementation plan

> **Regla de avance:** al terminar cada paso, el agente publica un resumen breve de lo hecho (archivos creados/editados, qué quedó funcionando y qué verificó) y **espera la confirmación del usuario** antes de arrancar el siguiente paso. No se ejecutan dos pasos consecutivos sin esa confirmación.

1. Ampliar `IconName` en `data/nav.ts` con `"eye"` y `"eye-off"`, y agregar sus paths en `components/ui/icons.tsx`. Verificar: `npx tsc --noEmit` (falla si falta uno de los dos, por el tipo `Record<IconName, IconDef>`).
2. Crear `app/(auth)/layout.tsx` con `min-h-screen` y fondo `#FBF4EC`. Verificar: `/login` conserva el placeholder pero ya con el fondo nuevo.
3. Crear `components/auth/LoginScreen.tsx` (`"use client"`) con el panel de marca y el formulario estático: inputs con `defaultValue`, sin estado ni navegación. Verificar: `npx tsc --noEmit`.
4. Reescribir `app/(auth)/login/page.tsx`: `metadata` + `<LoginScreen />`. Verificar en el navegador: `/login` muestra el mockup, ya no muestra el placeholder y no renderiza el bloque "INGRESO COMO".
5. Sumar al formulario de login el estado (`password`, `showPassword`, `errors`), el toggle de ojo y la navegación a `/` con `useRouter().push`. Verificar: con contraseña vacía aparece el error y no navega; con contraseña cargada navega a `/`.
6. Crear `components/auth/ActivateAccountScreen.tsx` con la estructura, el estado, la validación, el toggle de contraseña y la navegación a `/`.
7. Crear `app/(auth)/activar-cuenta/page.tsx` con `metadata` y `<ActivateAccountScreen />`. Verificar: `/activar-cuenta` responde 200 y el enlace "Activá tu cuenta" desde `/login` llega ahí.
8. Verificar: `npx tsc --noEmit`, `npx eslint app components data`, `npm run build`, y comparación por screenshot a 1280px contra los dos mockups, más un check móvil a 375px.

## Acceptance criteria

- [x] `npx tsc --noEmit` y `npm run build` terminan sin errores.
- [x] `npx eslint app components data` pasa sin errores.
- [x] `/login` renderiza el panel de marca con el gradiente, el logo, el titular "El día de cada niño, compartido con su familia.", el párrafo y el pie "🌿 Guardería Sala Soles".
- [x] `/login` muestra "Iniciar sesión", "Ingresá para ver el día de hoy.", EMAIL precargado con `caro@opendaycare.com`, CONTRASEÑA, "¿Olvidaste tu contraseña?" y el botón "Iniciar sesión".
- [x] `/login` no renderiza la sección "INGRESO COMO" ni los botones Personal / Familia.
- [x] Clic en "Iniciar sesión" con la contraseña cargada navega a `/`.
- [x] Clic con la contraseña vacía muestra el mensaje "Este campo es obligatorio." debajo del campo, con borde `#C5503A`, y no navega.
- [x] Vaciar el email y enviar también muestra ese error debajo de EMAIL.
- [x] Escribir en un campo con error limpia su error.
- [x] El toggle de ojo alterna el campo de contraseña entre `password` y `text`.
- [x] "Activá tu cuenta" navega a `/activar-cuenta`.
- [x] `/activar-cuenta` renderiza el logo, "Bienvenida a OpenDayCare", el párrafo y la tarjeta con el avatar "M" y "Mateo · Sala Soles".
- [x] Los campos muestran `7K4P9` y `lucia.fernandez@gmail.com`, y el consentimiento nace marcado con el check verde.
- [x] Clic en "Activar mi cuenta" con la contraseña cargada navega a `/`; con la contraseña vacía muestra el error y no navega.
- [x] "¿Ya tenés cuenta? Iniciar sesión" navega a `/login`.
- [x] A 1280px, `/login` y `/activar-cuenta` coinciden con `references/pantallas/login.dc.html` y `references/pantallas/activar-cuenta.dc.html`.
- [x] Por debajo de 768px el panel de marca se apila arriba sin el párrafo, y el formulario queda debajo.
- [x] `/login` no muestra el sidebar del `AppShell`.
- [x] Cada paso del plan termina con un resumen y la confirmación del usuario antes de pasar al siguiente.
  > Validado manualmente por el usuario (criterio de proceso, no verificable desde el repo). Evidencia en git: `git log --oneline` muestra un commit por paso (Paso 1…Paso 8).
- [x] El `<title>` de `/login` es "Iniciar sesión · OpenDayCare" y el de `/activar-cuenta` es "Activar cuenta · OpenDayCare".

## Decisions

- **Sí:** validar solo campos vacíos, sin formato ni fuerza de contraseña. Fue la opción elegida y es el mínimo verificable.
- **No:** selector de rol Personal/Familia. Decisión explícita del usuario: esa sección se omite y el login apunta a `/`.
- **Sí:** destino `/` para "Iniciar sesión" y para "Activar mi cuenta". El feed de familia no existe y así el flujo no queda en callejón sin salida.
- **Sí:** inputs precargados con los valores del mockup. Reproducción fiel para la comparación por screenshot.
- **Sí:** el panel de marca se apila arriba en móvil y solo se oculta su párrafo. Decisión del usuario; a ≥768px no cambia el layout de escritorio.
- **Sí:** toggle de visibilidad de contraseña. Decisión del usuario; exige los iconos nuevos `eye` y `eye-off`.
- **No:** el checkbox de consentimiento participa de la validación. Nace marcado, así que solo aportaría ruido; la validación elegida es de campos de texto.
- **Sí:** fondo `#FBF4EC` en `app/(auth)/layout.tsx`. El token `--color-cream` es `#F6ECDF` y se vería distinto al mockup.
- **No:** tokens nuevos en `app/globals.css`. Los colores de estos mockups van inline, por la convención de SPEC 01 y SPEC 02.
- **Sí:** `defaultValue` + `useState` en componentes cliente. Es la misma forma que `KidsSearch` de SPEC 02.
- **Sí:** `<Link>` de `next/link` en lugar del `<a>` del mockup. Evita recarga completa y respeta el App Router.
- **Sí:** paso a paso con resumen y confirmación del usuario entre cada paso del plan. Decisión del usuario; el avance se detiene tras cada resumen.
- **No:** CSS Modules ni librería de iconos. Mantiene la convención de SPEC 01.
- **No:** dar destino a "¿Olvidaste tu contraseña?". El mockup no lo define.

## Risks

| Risk | Mitigation |
| --- | --- |
| Agregar `eye` al union `IconName` sin `eye-off` rompe la compilación | Los dos se agregan en el mismo paso 1, con `Record<IconName, IconDef>` como detector |
| `#FBF4EC` choca con el `bg-cream` heredado de `body` | El fondo va en `app/(auth)/layout.tsx` con valor inline, cubriendo `min-h-screen` |
| El panel de marca con círculos `position:absolute` desborda al apilarse en móvil | `overflow-hidden` en el panel; el párrafo lleva `hidden md:block` |
| El responsive desvía el look de escritorio | No tocar valores desktop; validar por screenshot a 1280px |
| `useRouter` en un cliente dentro de `(auth)` con `cacheComponents` | Solo las páginas siguen siendo server components; el estado vive en el cliente |

## What is **not** in this spec

- La sección "INGRESO COMO" (Personal / Familia) y cualquier lógica de rol.
- Autenticación real, sesión y permisos.
- Feed de familia y rutas del lado de la familia.
- Recuperación de contraseña.
- Validación de formato o fuerza de contraseña.
- Registro sin invitación ni verificación real del código.
- Persistencia del consentimiento de fotos.

Cada uno, si llega, va en su propio spec.
