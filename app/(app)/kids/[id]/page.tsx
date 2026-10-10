import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/ui/icons";
import { KidProfileHeader } from "@/components/kids/KidProfileHeader";
import { AllergyNotice } from "@/components/kids/AllergyNotice";
import { KidInfoCard } from "@/components/kids/KidInfoCard";
import { LinkedParentsCard } from "@/components/kids/LinkedParentsCard";
import { getKid, kids } from "@/data/children";

// La ruta bloquea sobre `params`, así que se declara explícitamente y se
// silencia el validador `instant` de cacheComponents (dev-only).
export const instant = false;

// Los 8 perfiles se prerenderizan en build; sin esto `params` sería runtime
// data y exigiría <Suspense> por estar cacheComponents activo.
export async function generateStaticParams() {
  return kids.map((kid) => ({ id: kid.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kid = getKid(id);

  return { title: kid ? `${kid.name} · OpenDayCare` : "OpenDayCare" };
}

export default async function KidProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kid = getKid(id);

  if (!kid) notFound();

  const { profile } = kid;

  return (
    <div className="mx-auto w-full max-w-[820px] px-10 pt-[34px] pb-20">
      <Link
        href="/kids"
        className="mb-5 inline-flex items-center gap-[7px] text-[14px] font-bold text-ink-soft hover:text-primary-strong"
      >
        <Icon name="chevron-left" size={18} />
        Volver a Niños
      </Link>

      <div className="flex flex-wrap items-start gap-[26px]">
        <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
          <KidProfileHeader
            name={kid.name}
            initial={kid.initial}
            ageLabel={kid.ageLabel}
            room={profile.room}
            avatarBg={kid.avatarBg}
            avatarFg={kid.avatarFg}
          />

          <AllergyNotice note={profile.allergyNote} />

          <KidInfoCard
            rows={[
              { label: "Fecha de nacimiento", value: profile.birthDate },
              { label: "Sala", value: profile.room },
              { label: "Ingreso", value: profile.joinedAt },
            ]}
          />
        </div>

        <div className="flex w-full flex-none flex-col gap-[14px] md:w-[300px]">
          <Link
            href={`/kids/${kid.id}/summary`}
            className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-ink py-[13px] text-[15px] font-extrabold text-white"
          >
            <Icon name="sun" size={18} />
            Resumen del día
          </Link>

          <LinkedParentsCard parents={profile.parents} kidId={kid.id} />
        </div>
      </div>
    </div>
  );
}
