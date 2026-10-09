import Link from "next/link";
import { Icon } from "@/components/ui/icons";

export function Composer() {
  return (
    <Link
      href="/crear-publicacion"
      className="mb-6 flex items-center gap-[14px] rounded-[18px] border border-line bg-surface px-[18px] py-[14px] shadow-[0_4px_14px_-10px_rgba(120,90,60,.4)]"
    >
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-accent font-display text-[16px] font-semibold text-white">
        C
      </span>
      <span className="flex-1 text-[15px] text-ink-muted">
        Compartí un momento…
      </span>
      <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-tint text-primary">
        <Icon name="camera" size={19} />
      </span>
    </Link>
  );
}
