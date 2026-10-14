"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FieldError } from "@/components/auth/FieldError";
import { Icon } from "@/components/ui/icons";
import type { Kid } from "@/data/children";

// Colores exactos del mockup crear-publicacion.dc.html
const POST_TYPES = [
  { id: "comida", label: "Comida", bg: "#9A7B1E", fg: "#FFFFFF" },
  { id: "siesta", label: "Siesta", bg: "#E7DCF6", fg: "#7B5FC0" },
  { id: "actividad", label: "Actividad", bg: "#2E89A6", fg: "#FFFFFF" },
  { id: "logro", label: "Logro", bg: "#CFEBD8", fg: "#3E9B6C" },
  { id: "animo", label: "Ánimo", bg: "#F9D2DE", fg: "#C56486" },
  { id: "foto", label: "Foto", bg: "#FBD8CC", fg: "#D9684A" },
  { id: "anuncio", label: "Anuncio", bg: "#CCD8F4", fg: "#4E72C8" },
];

const ALL_ROOM = "toda-sala";

const SECTION_LABEL =
  "mb-2.5 block text-[12px] font-extrabold tracking-[0.7px] text-ink-soft";

type PostFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  kids: Pick<Kid, "id" | "name" | "initial" | "avatarBg" | "avatarFg">[];
};

export function PostForm({ action, kids }: PostFormProps) {
  const router = useRouter();
  const [recipients, setRecipients] = useState<string[]>([]);
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{
    recipients?: string;
    description?: string;
  }>({});

  // Los IDs de los niños que se muestran como chips — "Toda la sala" los
  // selecciona o deselecciona a todos.
  const kidIds = kids.map((kid) => kid.id);

  function toggleRecipient(id: string) {
    setErrors((prev) => ({ ...prev, recipients: undefined }));
    setRecipients((prev) => {
      if (id === ALL_ROOM) {
        // Seleccionar "Toda la sala" marca todos los niños; deseleccionar
        // deja la lista vacía.
        return prev.includes(ALL_ROOM) ? [] : [...kidIds, ALL_ROOM];
      }
      // Deseleccionar un niño individual cuando "Toda la sala" está activo
      // también quita "Toda la sala".
      const withoutAll = prev.filter((r) => r !== ALL_ROOM);
      return withoutAll.includes(id)
        ? withoutAll.filter((r) => r !== id)
        : [...withoutAll, id];
    });
  }

  function toggleType(id: string) {
    setType((prev) => (prev === id ? "" : id));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors: typeof errors = {};

    if (recipients.length === 0) {
      nextErrors.recipients = "Seleccioná al menos un destinatario.";
    }

    if (!description.trim()) {
      nextErrors.description = "Este campo es obligatorio.";
    }

    if (nextErrors.recipients || nextErrors.description) {
      event.preventDefault();
      setErrors(nextErrors);
    }
  }

  const isAllRoom = recipients.includes(ALL_ROOM);

  return (
    <form action={action} onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-line px-[26px] py-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-[15px] font-bold text-ink-soft"
        >
          Cancelar
        </button>
        <span className="font-display text-[18px] font-semibold text-ink">
          Nueva publicación
        </span>
        <button
          type="submit"
          className="text-[15px] font-extrabold text-primary-strong"
        >
          Publicar
        </button>
      </div>

      {/* Contenido */}
      <div className="px-[26px] py-5">
        {/* PARA */}
        <span className={SECTION_LABEL}>PARA</span>
        <div className="mb-[16px] flex flex-wrap gap-[9px]">
          {kids.map((kid) => {
            const selected = recipients.includes(kid.id);
            return (
              <button
                key={kid.id}
                type="button"
                onClick={() => toggleRecipient(kid.id)}
                className="flex items-center gap-2 rounded-full border-[1.5px] py-[6px] pr-[14px] pl-[6px] text-[14px] font-bold"
                style={
                  selected
                    ? {
                        borderColor: "#3F362E",
                        background: "#3F362E",
                        color: "#FFFFFF",
                      }
                    : {
                        borderColor: "#ECE0D0",
                        background: "#FFFDF9",
                        color: "#6E6359",
                      }
                }
              >
                <span
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full font-display text-[13px] font-semibold"
                  style={{ background: kid.avatarBg, color: kid.avatarFg }}
                >
                  {kid.initial}
                </span>
                {kid.name.split(" ")[0]}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => toggleRecipient(ALL_ROOM)}
            className="rounded-full border-[1.5px] px-4 py-[6px] text-[14px] font-bold"
            style={
              isAllRoom
                ? {
                    borderColor: "#3F362E",
                    background: "#3F362E",
                    color: "#FFFFFF",
                  }
                : {
                    borderColor: "#ECE0D0",
                    background: "#FFFDF9",
                    color: "#6E6359",
                  }
            }
          >
            Toda la sala
          </button>
        </div>
        {errors.recipients && <FieldError message={errors.recipients} />}

        {/* TIPO */}
        <span className={SECTION_LABEL}>TIPO</span>
        <div className="mb-[16px] flex flex-wrap gap-[9px]">
          {POST_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleType(t.id)}
              className="rounded-full px-4 py-2 text-[13.5px] font-extrabold"
              style={{
                background: t.bg,
                color: t.fg,
                opacity: type === t.id || !type ? 1 : 0.55,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* DESCRIPCIÓN */}
        <span className={SECTION_LABEL}>DESCRIPCIÓN</span>
        <textarea
          name="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          placeholder="Contá cómo le fue hoy…"
          className="mb-[16px] min-h-[96px] w-full resize-y rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-3 text-[15px] leading-normal text-ink outline-none placeholder:text-[#B6A99B] focus-visible:ring-2 focus-visible:ring-accent"
        />
        {errors.description && <FieldError message={errors.description} />}

        {/* FOTOS */}
        <span className={SECTION_LABEL}>FOTOS</span>
        <div className="flex gap-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-[14px] border border-line bg-[#F4ECE1] text-[#CBB89F]">
            <Icon name="image" size={26} strokeWidth={1.7} />
          </div>
          <button
            type="button"
            className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
          >
            <Icon name="plus" size={22} strokeWidth={2} className="text-primary-deep" />
            <span className="text-[12px]">Agregar</span>
          </button>
        </div>
      </div>

      {/* Hidden inputs para el FormData del server action */}
      {recipients.map((id) => (
        <input key={id} type="hidden" name="recipients" value={id} />
      ))}
      {type && <input type="hidden" name="type" value={type} />}
    </form>
  );
}
