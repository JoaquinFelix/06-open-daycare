import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkParentModal } from "@/components/kids/LinkParentModal";
import { getKid, kids } from "@/data/children";
import { sendParentInvite } from "./actions";

// La ruta bloquea sobre `params` (lookup en memoria, sin I/O), así que se
// declara explícamente y se sale del validador `instant` de cacheComponents.
// En dev el validador igual avisa "Route ... encountered URL data ... outside
// <Suspense>"; es una pista de performance, no un error, y hace lo mismo en
// app/(app)/kids/[id]/page.tsx. Envolverlo en <Suspense> exigiría duplicar la
// tarjeta en un fallback que nunca se ve.
export const instant = false;

export async function generateStaticParams() {
  return kids.map((kid) => ({ id: kid.id }));
}

export const metadata: Metadata = {
  title: "Vincular padre · OpenDayCare",
};

// La tarjeta vive en un overlay a pantalla completa, igual que el perfil
// (fondo plano, card centrada arriba).
export default async function LinkParentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kid = getKid(id);

  if (!kid) notFound();

  return <LinkParentModal kid={kid} action={sendParentInvite} />;
}
