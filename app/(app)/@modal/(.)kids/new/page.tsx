import type { Metadata } from "next";
import { KidNewModalShell } from "@/components/kids/KidNewModalShell";
import { AddChildForm } from "@/components/kids/AddChildForm";
import { createChild } from "@/app/(app)/kids/new/actions";

export const metadata: Metadata = {
  title: "Agregar niño · OpenDayCare",
};

export default function InterceptedNewKidPage() {
  return (
    <KidNewModalShell>
      <AddChildForm action={createChild} />
    </KidNewModalShell>
  );
}