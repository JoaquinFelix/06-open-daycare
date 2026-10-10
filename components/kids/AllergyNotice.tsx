import { Icon } from "@/components/ui/icons";

// Bloque de alerta: solo se renderiza si el niño tiene alergias cargadas.
export function AllergyNotice({ note }: { note?: string }) {
  if (!note) return null;

  return (
    <div className="flex gap-[14px] rounded-[16px] bg-[#FBDAD6] p-[18px]">
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[#F4A8A0] text-white">
        <Icon name="alert" size={22} />
      </span>

      <div>
        <div className="mb-0.5 text-[15px] font-extrabold text-[#C5413A]">
          Alergias y notas
        </div>
        <p className="text-[14.5px] leading-[1.5] text-[#B25249]">{note}</p>
      </div>
    </div>
  );
}
