import type { Metadata } from "next";
import { KidModalShell } from "@/components/kids/KidModalShell";
import { AddChildForm } from "@/components/kids/AddChildForm";
import { createChild } from "./actions";

export const metadata: Metadata = {
  title: "Agregar niño · OpenDayCare",
};

// Modal sobre el AppShell: la tarjeta vive en un overlay a pantalla completa,
// igual que agregar-nino.dc.html (fondo plano, card centrada arriba).
export default function NewKidPage() {
  return (
    <KidModalShell>
      <AddChildForm action={createChild} />
    </KidModalShell>
  );
}
