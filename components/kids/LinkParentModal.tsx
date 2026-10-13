import { connection } from "next/server";
import type { Kid } from "@/data/children";
import { KidModalShell } from "@/components/kids/KidModalShell";
import { LinkParentForm } from "@/components/kids/LinkParentForm";
import { randomInviteCode } from "@/lib/parent-invite";

// Tarjeta del overlay "Vincular padre" (SPEC 05). Es el mismo componente en la
// ruta real y en la intercepting route del @modal, así no se duplica.
export async function LinkParentModal({
  kid,
  action,
}: {
  kid: Kid;
  action: (formData: FormData) => void | Promise<void>;
}) {
  // El segmento se prerenderiza estático por niño, así que sin esto el código
  // quedaría fijo en el build. `connection()` lo ancla a la request.
  await connection();

  // "Mateo Fernández" → "Mateo": el banner del mockup usa el nombre de pila.
  const [kidFirstName] = kid.name.split(" ");
  const code = randomInviteCode();

  return (
    <KidModalShell maxWidth={480}>
      <LinkParentForm
        action={action}
        kidId={kid.id}
        kidName={kid.name}
        kidFirstName={kidFirstName}
        code={code}
      />
    </KidModalShell>
  );
}
