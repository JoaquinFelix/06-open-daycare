"use client";

import { usePathname } from "next/navigation";

// Rutas que este slot intercepta. Fuera de ellas el overlay no puede quedarse
// montado: al navegar hacia adelante desde una ruta interceptada, Next.js
// conserva el contenido previo del slot (limitación conocida, vercel/next.js
// #49662 / #71795) y sólo `router.back()` lo limpiaría. Este guard cierra el
// overlay ante cualquier navegación: envío del form, Link o redirect.
const MODAL_ROUTES = [
  /^\/kids\/new$/,
  /^\/kids\/[^/]+\/link-parent$/,
  /^\/crear-publicacion$/,
];

export default function ModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return MODAL_ROUTES.some((route) => route.test(pathname)) ? (
    <>{children}</>
  ) : null;
}
