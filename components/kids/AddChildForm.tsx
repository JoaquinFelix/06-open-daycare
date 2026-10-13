"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FieldError } from "@/components/auth/FieldError";
import { Icon } from "@/components/ui/icons";
import { ROOMS } from "@/data/rooms";
import { isFutureDate, maskDate, parseDate } from "@/lib/child-form";

type Values = {
  name: string;
  birthDate: string;
  room: string;
  allergies: string;
  notes: string;
};

type FieldErrors = Partial<Record<keyof Values, string>>;

const REQUIRED_MESSAGE = "Este campo es obligatorio.";
const INVALID_DATE_MESSAGE = "Ingresá una fecha válida y no futura.";

const LABEL_CLASS =
  "mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-ink-soft";

function inputClass(hasError: boolean): string {
  return `w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink outline-none placeholder:text-[#B6A99B] focus-visible:ring-2 focus-visible:ring-accent ${
    hasError ? "border-primary-deep" : "border-[#EADFD0]"
  }`;
}

// Sólo los 3 campos obligatorios: alergias y notas nunca fallan.
function validate({ name, birthDate, room }: Values): FieldErrors {
  const errors: FieldErrors = {};

  if (!name.trim()) errors.name = REQUIRED_MESSAGE;

  if (!birthDate.trim()) {
    errors.birthDate = REQUIRED_MESSAGE;
  } else {
    const date = parseDate(birthDate);
    if (!date || isFutureDate(date)) errors.birthDate = INVALID_DATE_MESSAGE;
  }

  if (!room) errors.room = REQUIRED_MESSAGE;

  return errors;
}

export function AddChildForm({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>({
    name: "",
    birthDate: "",
    room: ROOMS[0],
    allergies: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});

  function updateField(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Escribir en el campo limpia su error.
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    // Con errores no se navega: React no ejecuta la Server Action.
    if (Object.values(nextErrors).some(Boolean)) event.preventDefault();
  }

  function handleCancel() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/kids");
  }

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      noValidate
      className="w-full"
    >
      <div className="flex items-center justify-between border-b border-line px-[26px] py-5">
        <button
          type="button"
          onClick={handleCancel}
          className="text-[15px] font-bold text-ink-soft hover:text-primary-strong"
        >
          Cancelar
        </button>
        <span className="font-display text-[18px] font-semibold text-ink">
          Agregar niño
        </span>
        <button
          type="submit"
          className="text-[15px] font-extrabold text-primary-strong hover:text-primary-deep"
        >
          Guardar
        </button>
      </div>

      <div className="px-[26px] py-6">
        <div className="mb-[18px]">
          <label htmlFor="child-name" className={LABEL_CLASS}>
            NOMBRE COMPLETO
          </label>
          <input
            id="child-name"
            name="name"
            type="text"
            autoComplete="off"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Ej. Martina López"
            aria-invalid={Boolean(errors.name)}
            className={inputClass(Boolean(errors.name))}
          />
          {errors.name && <FieldError message={errors.name} />}
        </div>

        <div className="mb-[18px] flex gap-[14px]">
          <div className="min-w-0 flex-1">
            <label htmlFor="child-birth-date" className={LABEL_CLASS}>
              FECHA DE NACIMIENTO
            </label>
            <input
              id="child-birth-date"
              name="birthDate"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={values.birthDate}
              onChange={(event) =>
                updateField("birthDate", maskDate(event.target.value))
              }
              placeholder="dd/mm/aaaa"
              aria-invalid={Boolean(errors.birthDate)}
              className={inputClass(Boolean(errors.birthDate))}
            />
            {errors.birthDate && <FieldError message={errors.birthDate} />}
          </div>

          <div className="min-w-0 flex-1">
            <label htmlFor="child-room" className={LABEL_CLASS}>
              SALA
            </label>
            <div className="relative">
              <select
                id="child-room"
                name="room"
                value={values.room}
                onChange={(event) => updateField("room", event.target.value)}
                aria-invalid={Boolean(errors.room)}
                className={`w-full appearance-none rounded-[14px] border-[1.5px] bg-white py-[13px] pr-10 pl-4 text-[15px] font-bold text-ink outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  errors.room ? "border-primary-deep" : "border-[#EADFD0]"
                }`}
              >
                <option value="">Elegí una sala</option>
                {ROOMS.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                size={16}
                className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[#B0A290]"
              />
            </div>
            {errors.room && <FieldError message={errors.room} />}
          </div>
        </div>

        <div className="mb-[18px]">
          <label htmlFor="child-allergies" className={LABEL_CLASS}>
            ALERGIAS (ETIQUETAS)
          </label>
          <input
            id="child-allergies"
            name="allergies"
            type="text"
            autoComplete="off"
            value={values.allergies}
            onChange={(event) => updateField("allergies", event.target.value)}
            placeholder="Ej. Maní, Lactosa"
            className={inputClass(false)}
          />
        </div>

        <div>
          <label htmlFor="child-notes" className={LABEL_CLASS}>
            NOTAS MÉDICAS
          </label>
          <textarea
            id="child-notes"
            name="notes"
            value={values.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            placeholder="Indicaciones, medicación, contactos…"
            className={`${inputClass(false)} min-h-[90px] resize-y leading-[1.5]`}
          />
        </div>
      </div>
    </form>
  );
}
