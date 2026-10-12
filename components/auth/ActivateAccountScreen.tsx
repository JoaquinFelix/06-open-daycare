"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FieldError } from "@/components/auth/FieldError";
import { Icon } from "@/components/ui/icons";

type ActivateErrors = { code: boolean; email: boolean; password: boolean };

// Réplica de references/pantallas/activar-cuenta.dc.html.
export function ActivateAccountScreen() {
  const router = useRouter();
  const [code, setCode] = useState("7K4P9");
  const [email, setEmail] = useState("lucia.fernandez@gmail.com");
  const [password, setPassword] = useState("");
  const [consent, setConsent] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ActivateErrors>({
    code: false,
    email: false,
    password: false,
  });

  function updateField(field: keyof ActivateErrors, value: string) {
    if (field === "code") setCode(value);
    else if (field === "email") setEmail(value);
    else setPassword(value);
    setErrors((prev) => (prev[field] ? { ...prev, [field]: false } : prev));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: ActivateErrors = {
      code: code.trim() === "",
      email: email.trim() === "",
      password: password === "",
    };
    if (nextErrors.code || nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }
    router.push("/");
  }

  const fieldBorder = (hasError: boolean, rest?: string) =>
    hasError ? "border-primary-deep" : (rest ?? "border-[#EADFD0]");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBF4EC] p-6 md:p-10">
      <div className="w-full max-w-[440px]">
        <div className="mb-[22px] flex h-[58px] w-[58px] items-center justify-center rounded-[18px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] shadow-[0_12px_26px_-10px_rgba(238,129,100,.65)]">
          <Icon name="sun" size={30} strokeWidth={2.2} />
        </div>

        <h1 className="mb-2 font-display text-[32px] leading-[1.15] font-semibold text-ink">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mb-[26px] text-[15.5px] leading-[1.55] text-ink-soft">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para
          activar la cuenta.
        </p>

        <div className="mb-[22px] flex items-center gap-[14px] rounded-2xl border-[1.5px] border-[#EADFD0] bg-white p-[14px_16px]">
          <span className="flex h-[44px] w-[44px] flex-none items-center justify-center rounded-full bg-[#A9D9E8] font-display text-[19px] font-semibold text-[#1F7A93]">
            M
          </span>
          <span className="min-w-0">
            <span className="block text-[13px] text-ink-soft">
              Te invitaron a seguir a
            </span>
            <span className="block font-display text-[17px] font-semibold text-ink">
              Mateo · Sala Soles
            </span>
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-[18px]">
            <label
              htmlFor="activate-code"
              className="mb-2 block text-[12px] font-bold tracking-[0.7px] text-ink-soft"
            >
              CÓDIGO DE INVITACIÓN
            </label>
            <input
              id="activate-code"
              type="text"
              value={code}
              onChange={(event) => updateField("code", event.target.value)}
              aria-invalid={errors.code}
              className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[14px] font-display text-[18px] font-bold tracking-[3px] text-ink outline-none placeholder:text-[#B6A99B] focus-visible:ring-2 focus-visible:ring-accent ${fieldBorder(
                errors.code,
              )}`}
            />
            {errors.code && <FieldError />}
          </div>

          <div className="mb-[18px]">
            <label
              htmlFor="activate-email"
              className="mb-2 block text-[12px] font-bold tracking-[0.7px] text-ink-soft"
            >
              EMAIL
            </label>
            <input
              id="activate-email"
              type="email"
              value={email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={errors.email}
              className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-[#B6A99B] focus-visible:ring-2 focus-visible:ring-accent ${fieldBorder(
                errors.email,
              )}`}
            />
            {errors.email && <FieldError />}
          </div>

          <div className="mb-[18px]">
            <label
              htmlFor="activate-password"
              className="mb-2 block text-[12px] font-bold tracking-[0.7px] text-ink-soft"
            >
              CREAR CONTRASEÑA
            </label>
            <div className="relative">
              <input
                id="activate-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                placeholder="••••••••"
                aria-invalid={errors.password}
                className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[14px] pr-11 text-[15px] text-ink outline-none placeholder:text-[#B6A99B] focus-visible:ring-2 focus-visible:ring-accent ${fieldBorder(
                  errors.password,
                  "border-[#F2A78E]",
                )}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft"
              >
                <Icon name={showPassword ? "eye-off" : "eye"} size={19} />
              </button>
            </div>
            {errors.password && <FieldError />}
          </div>

          <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-[14px] bg-[#FBF1D6] p-[14px_16px]">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={`mt-px flex h-6 w-6 flex-none items-center justify-center rounded-[8px] peer-focus-visible:ring-2 peer-focus-visible:ring-accent ${
                consent
                  ? "bg-[#5FB97E]"
                  : "border-[1.5px] border-[#DFD2BC] bg-white"
              }`}
            >
              {consent && (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
            <span className="text-[14px] leading-[1.45] text-[#8A7234]">
              Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro
              de la app.
            </span>
          </label>

          <button
            type="submit"
            className="block w-full rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] py-[15px] text-center text-[16px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
          >
            Activar mi cuenta
          </button>
        </form>

        <p className="mt-[22px] text-center text-[14.5px] text-ink-soft">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-extrabold text-primary-deep">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
