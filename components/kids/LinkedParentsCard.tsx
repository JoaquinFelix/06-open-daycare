import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import type { Parent, ParentStatus } from "@/data/children";

const STATUS_PILL: Record<ParentStatus, string> = {
  active: "bg-[#CFEBD8] text-[#3E9B6C]",
  pending: "bg-[#F7E7A6] text-[#9A7B1E]",
};

function ParentRow({ parent }: { parent: Parent }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full font-display text-[16px] font-semibold text-white"
        style={{ backgroundColor: parent.avatarBg }}
      >
        {parent.initial}
      </span>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[14.5px] font-extrabold text-ink">
          {parent.name}
        </div>
        <div className="text-[12.5px] text-ink-muted">
          {parent.relation} · {parent.statusLabel}
        </div>
      </div>

      <span
        className={`flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold ${STATUS_PILL[parent.status]}`}
      >
        {parent.status === "active" ? "ACTIVA" : "PENDIENTE"}
      </span>
    </div>
  );
}

export function LinkedParentsCard({
  parents,
  kidId,
}: {
  parents: Parent[];
  kidId: string;
}) {
  return (
    <div className="rounded-[16px] border border-line bg-surface p-[18px]">
      <div className="mb-[14px] text-[12.5px] font-extrabold tracking-[0.8px] text-label">
        PADRES VINCULADOS
      </div>

      <div className="flex flex-col gap-[14px]">
        {parents.map((parent) => (
          <ParentRow key={parent.name} parent={parent} />
        ))}

        <Link
          href={`/kids/${kidId}/link-parent`}
          className="flex items-center gap-3 pt-2"
        >
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
            <Icon name="plus" size={18} />
          </span>
          <span className="text-[14.5px] font-extrabold text-primary-deep">
            Vincular otro padre
          </span>
        </Link>
      </div>
    </div>
  );
}
