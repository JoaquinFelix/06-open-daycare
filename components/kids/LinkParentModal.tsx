import type { Kid } from "@/data/children";
import { KidModalShell } from "@/components/kids/KidModalShell";
import { LinkParentForm } from "@/components/kids/LinkParentForm";

// Tarjeta del overlay "Vincular padre" (SPEC 05). Es el mismo componente en la
// ruta real y en la intercepting route del @modal, así no se duplica.
export function LinkParentModal({
  kid,
  action,
}: {
  kid: Kid;
  action: (formData: FormData) => void | Promise<void>;
}) {
  // "Mateo Fernández" → "Mateo": el banner del mockup usa el nombre de pila.
  const [kidFirstName] = kid.name.split(" ");

  return (
    <KidModalShell maxWidth={480}>
      <LinkParentForm
        action={action}
        kidId={kid.id}
        kidName={kid.name}
        kidFirstName={kidFirstName}
      />
    </KidModalShell>
  );
}
