import type { Metadata } from "next";
import { KidModalShell } from "@/components/kids/KidModalShell";
import { AddChildForm } from "@/components/kids/AddChildForm";
import { createChild } from "@/app/(app)/kids/new/actions";

export const metadata: Metadata = {
  title: "Agregar niño · OpenDayCare",
};

export default function InterceptedNewKidPage() {
  return (
    <KidModalShell>
      <AddChildForm action={createChild} />
    </KidModalShell>
  );
}