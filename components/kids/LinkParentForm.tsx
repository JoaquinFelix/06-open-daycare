"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FieldError } from "@/components/auth/FieldError";
import { Icon } from "@/components/ui/icons";
import { PARENT_RELATIONS, type ParentRelation } from "@/data/children";
import { isValidEmail } from "@/lib/parent-invite";

type Values = {
  name: string;
  email: string;
  relation: ParentRelation;
};

type FieldErrors = Partial<Record<"name" | "email", string>>;

const REQUIRED_MESSAGE = "Este campo es obligatorio.";
const INVALID_EMAIL_MESSAGE = "Ingresá un email válido.";

const LABEL_CLASS =
  "mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-ink-soft";

function inputClass(hasError: boolean): string {
  return `w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink outline-none placeholder:text-[#B6A99B] focus-visible:ring-2 focus-visible:ring-accent ${
    hasError ? "border-primary-deep" : "border-[#EADFD0]"
  }`;
}

function pillClass(active: boolean): string {
  return `flex-1 rounded-full border-[1.5px] py-[11px] text-[14px] font-extrabold ${
    active
      ? "border-[#9FB8EC] bg-[#CCD8F4] text-[#4E72C8]"
      : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
  }`;
}

// Sólo nombre y email pueden fallar: parentesco siempre tiene valor.
function validate({ name, email }: Values): FieldErrors {
  const errors: FieldErrors = {};

  if (!name.trim()) errors.name = REQUIRED_MESSAGE;

  if (!email.trim()) {
    errors.email = REQUIRED_MESSAGE;
  } else if (!isValidEmail(email)) {
    errors.email = INVALID_EMAIL_MESSAGE;
  }

  return errors;
}

// Réplica de references/pantallas/vincular-padre.dc.html. El código de
// invitación lo genera el server component padre (`LinkParentModal`), uno por
// apertura: acá sólo se muestra.
export function LinkParentForm({
  action,
  kidId,
  kidName,
  kidFirstName,
  code,
}: {
  action: (formData: FormData) => void | Promise<void>;
  kidId: string;
  kidName: string;
  kidFirstName: string;
  code: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    relation: PARENT_RELATIONS[0],
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

  function handleClose() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(`/kids/${kidId}`);
  }

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      noValidate
      className="w-full"
    >
      <div className="flex items-center justify-between border-b border-line px-[26px] py-5">
        <div>
          <div className="font-display text-[18px] font-semibold text-ink">
            Vincular padre
          </div>
          <div className="text-[13px] text-ink-muted">a {kidName}</div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Cerrar"
          className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] bg-[#F0E6D8] text-[#94887B]"
        >
          <Icon name="close" size={18} strokeWidth={2.2} />
        </button>
      </div>

      <div className="px-[26px] py-[22px]">
        <div className="mb-5 flex gap-[11px] rounded-[14px] bg-[#E3ECFB] px-4 py-[13px]">
          <Icon
            name="info"
            size={20}
            className="mt-px flex-none text-[#4E72C8]"
          />
          <span className="text-[13.5px] leading-[1.45] text-[#3F5694]">
            Le enviaremos un correo con un código para que active su cuenta.
            Solo verá el feed de {kidFirstName}.
          </span>
        </div>

        <div className="mb-[18px]">
          <label htmlFor="parent-name" className={LABEL_CLASS}>
            NOMBRE DEL PADRE/MADRE
          </label>
          <input
            id="parent-name"
            name="name"
            type="text"
            autoComplete="off"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Ej. Diego Fernández"
            aria-invalid={Boolean(errors.name)}
            className={inputClass(Boolean(errors.name))}
          />
          {errors.name && <FieldError message={errors.name} />}
        </div>

        <div className="mb-[18px]">
          <label htmlFor="parent-email" className={LABEL_CLASS}>
            EMAIL
          </label>
          <input
            id="parent-email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="correo@ejemplo.com"
            aria-invalid={Boolean(errors.email)}
            className={inputClass(Boolean(errors.email))}
          />
          {errors.email && <FieldError message={errors.email} />}
        </div>

        <fieldset className="mb-5">
          <legend className="mb-[10px] text-[12px] font-extrabold tracking-[0.7px] text-ink-soft">
            PARENTESCO
          </legend>
          <div className="flex gap-[9px]">
            {PARENT_RELATIONS.map((relation) => {
              const active = values.relation === relation;
              return (
                <button
                  key={relation}
                  type="button"
                  aria-pressed={active}
                  onClick={() => updateField("relation", relation)}
                  className={pillClass(active)}
                >
                  {relation}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-[#E6D08A] bg-[#FBF1D6] px-[18px] py-[18px] text-center">
          <div className="mb-2 text-[12px] font-extrabold tracking-[0.7px] text-[#A88526]">
            CÓDIGO DE INVITACIÓN
          </div>
          <div className="font-display text-[34px] font-semibold tracking-[7px] text-[#8A7234]">
            {code}
          </div>
          <div className="mt-[6px] text-[13px] text-[#A88526]">
            Vence en 7 días
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] py-[14px] text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
        >
          <Icon name="send" size={19} />
          Enviar invitación
        </button>
      </div>

      <input type="hidden" name="kidId" value={kidId} />
      <input type="hidden" name="relation" value={values.relation} />
    </form>
  );
}
