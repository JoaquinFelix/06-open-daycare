import type { Metadata } from "next";
import { AddChildForm } from "@/components/kids/AddChildForm";
import { createChild } from "./actions";

export const metadata: Metadata = {
  title: "Agregar niño · OpenDayCare",
};

// Modal sobre el AppShell: la tarjeta vive en un overlay a pantalla completa,
// igual que agregar-nino.dc.html (fondo plano, card centrada arriba).
export default function NewKidPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-cream px-6 py-10">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-line bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]">
        <AddChildForm action={createChild} />
      </div>
    </div>
  );
}
