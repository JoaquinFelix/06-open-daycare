import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LinkParentModal } from "@/components/kids/LinkParentModal";
import { getKid, kids } from "@/data/children";
import { sendParentInvite } from "./actions";

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
