import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import type { Kid, KidBadge } from "@/data/children";

// Tono del badge: alergia (rosa/rojo) vs "vincular" (rosa/maíz)
const BADGE_CLASSES: Record<KidBadge["variant"], string> = {
  allergy: "bg-[#FBD8CC] text-[#D9684A]",
  link: "bg-[#F9D2DE] text-[#C56486]",
};

export function KidCard({ kid }: { kid: Kid }) {
  return (
    <Link
      href={`/kids/${kid.id}`}
      className="flex min-w-0 items-center gap-[14px] rounded-[18px] border border-line bg-surface p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)] transition duration-150 hover:-translate-y-0.5 hover:border-[#F2A78E]"
    >
      <span
        className="flex h-12 w-12 flex-none items-center justify-center rounded-full font-display text-[19px] font-semibold"
        style={{ backgroundColor: kid.avatarBg, color: kid.avatarFg }}
      >
        {kid.initial}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[16px] font-semibold text-ink">
          {kid.name}
        </span>
        <span className="block text-[13px] text-ink-muted">
          {kid.ageLabel} · {kid.parentsLabel}
        </span>
      </span>

      {kid.badge ? (
        <span
          className={`flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold ${BADGE_CLASSES[kid.badge.variant]}`}
        >
          {kid.badge.label}
        </span>
      ) : (
        <Icon name="chevron-right" size={18} className="flex-none text-[#CBB89F]" />
      )}
    </Link>
  );
}
