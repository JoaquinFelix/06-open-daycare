import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkParentModal } from "@/components/kids/LinkParentModal";
import { getKid } from "@/data/children";
import { sendParentInvite } from "@/app/(app)/kids/[id]/link-parent/actions";

// Mismo criterio que la ruta real (y que app/(app)/kids/[id]/page.tsx): la
// ruta se resuelve bloqueando sobre `params`, así que se opta out del
// validador `instant`. El aviso de dev sobre "URL data fuera de <Suspense>"
// es esperado y no rompe la intercepción.
export const instant = false;

export const metadata: Metadata = {
  title: "Vincular padre · OpenDayCare",
};

// Intercepta la navegación desde el perfil del niño: se muestra la misma
// tarjeta del overlay superpuesta a `/kids/[id]`, en lugar de reemplazarla.
export default async function InterceptedLinkParentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kid = getKid(id);

  if (!kid) notFound();

  return <LinkParentModal kid={kid} action={sendParentInvite} />;
}
