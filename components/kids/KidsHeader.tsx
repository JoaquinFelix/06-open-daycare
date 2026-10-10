import Link from "next/link";
import { Icon } from "@/components/ui/icons";

export function KidsHeader() {
  return (
    <div className="mb-[22px] flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-1 text-[12.5px] font-extrabold tracking-[0.8px] text-primary-strong">
          GESTIÓN
        </p>
        <h1 className="font-display text-[30px] font-semibold text-ink">
          Niños
        </h1>
      </div>

      <Link
        href="/kids/new"
        className="flex items-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)]"
      >
        <Icon name="plus" size={17} />
        Agregar niño
      </Link>
    </div>
  );
}
