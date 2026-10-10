import Link from "next/link";
// Encabezado del perfil: avatar grande, nombre, edad/sala y botón "Editar".
export function KidProfileHeader({
  name,
  initial,
  ageLabel,
  room,
  avatarBg,
  avatarFg,
}: {
  name: string;
  initial: string;
  ageLabel: string;
  room: string;
  avatarBg: string;
  avatarFg: string;
}) {
  return (
    <div className="flex items-center gap-[18px]">
      <span
        className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-full font-display text-[34px] font-semibold"
        style={{ backgroundColor: avatarBg, color: avatarFg }}
      >
        {initial}
      </span>

      <div className="flex-1">
        <h1 className="font-display text-[28px] font-semibold text-ink">
          {name}
        </h1>
        <p className="mt-[3px] text-[15px] text-ink-soft">
          {ageLabel} · Sala {room}
        </p>
      </div>

      <Link
        href="/kids/new"
        className="rounded-[12px] border-[1.5px] border-line bg-surface px-4 py-[9px] text-[14px] font-bold whitespace-nowrap text-nav-idle hover:border-[#F2A78E]"
      >
        Editar
      </Link>
    </div>
  );
}
