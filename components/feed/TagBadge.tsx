import type { FeedTag } from "@/data/feed";

const TAG_STYLES: Record<FeedTag, { label: string; classes: string }> = {
  logro: { label: "LOGRO", classes: "bg-[#CFEBD8] text-[#3E9B6C]" },
  actividad: { label: "ACTIVIDAD", classes: "bg-[#C7E7F1] text-[#2E89A6]" },
  anuncio: { label: "ANUNCIO", classes: "bg-[#CCD8F4] text-[#4E72C8]" },
};

export function TagBadge({ tag }: { tag: FeedTag }) {
  const { label, classes } = TAG_STYLES[tag];

  return (
    <span
      className={`flex flex-none items-center gap-[7px] rounded-full px-3 py-1.5 ${classes}`}
    >
      <span className="h-2 w-2 rounded-full bg-current" />
      <span className="text-[12px] font-extrabold tracking-[0.5px]">
        {label}
      </span>
    </span>
  );
}
