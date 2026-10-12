"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icons";

// Réplica de references/pantallas/login.dc.html, sin la sección "INGRESO COMO".
export function LoginScreen() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#FBF4EC] md:grid-cols-[1.05fr_1fr]">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#F6A98E_0%,#F2937A_45%,#EC7E62_100%)] px-6 py-9 text-white md:px-[60px] md:py-[56px]">
        <div className="absolute top-[-140px] right-[-120px] h-[420px] w-[420px] rounded-full bg-[rgba(255,255,255,.12)]" />
        <div className="absolute bottom-[-110px] left-[-80px] h-[300px] w-[300px] rounded-full bg-[rgba(255,255,255,.10)]" />

        <div className="relative flex items-center gap-[13px]">
          <span className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] bg-[rgba(255,255,255,.22)]">
            <Icon name="sun" size={26} strokeWidth={2.2} />
          </span>
          <span className="font-display text-[21px] font-semibold tracking-[0.5px]">
            OpenDayCare
          </span>
        </div>

        <div className="relative">
          <h1 className="mb-[18px] font-display text-[42px] font-semibold leading-[1.12]">
            El día de cada niño,
            <br />
            compartido con su familia.
          </h1>
          {/* En móvil el banner queda solo con el titular (SPEC 03) */}
          <p className="hidden max-w-[430px] text-[17px] leading-[1.6] text-[rgba(255,255,255,.92)] md:block">
            Publicá momentos, gestioná las salas y mantené a las familias cerca,
            desde un solo lugar.
          </p>
        </div>

        <div className="relative text-[14px] text-[rgba(255,255,255,.9)]">
          🌿 Guardería Sala Soles
        </div>
      </aside>

      <div className="flex items-center justify-center px-6 py-10 md:p-10">
        <div className="w-full max-w-[392px]">
          <h2 className="mb-[6px] font-display text-[30px] font-semibold text-ink">
            Iniciar sesión
          </h2>
          <p className="mb-7 text-[15px] text-ink-soft">
            Ingresá para ver el día de hoy.
          </p>

          <label
            htmlFor="login-email"
            className="mb-[9px] block text-[12px] font-bold tracking-[0.7px] text-ink-soft"
          >
            EMAIL
          </label>
          <input
            id="login-email"
            type="email"
            defaultValue="caro@opendaycare.com"
            className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-[#B6A99B]"
          />

          <label
            htmlFor="login-password"
            className="mb-2 block text-[12px] font-bold tracking-[0.7px] text-ink-soft"
          >
            CONTRASEÑA
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            className="mb-[10px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[14px] text-[15px] text-ink outline-none placeholder:text-[#B6A99B]"
          />

          <div className="mb-5 text-right">
            <span className="cursor-pointer text-[13.5px] font-bold text-primary-deep">
              ¿Olvidaste tu contraseña?
            </span>
          </div>

          <button
            type="button"
            className="block w-full rounded-[15px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] py-[15px] text-center text-[16px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
          >
            Iniciar sesión
          </button>

          <p className="mt-6 text-center text-[14.5px] text-ink-soft">
            ¿Te invitó la guardería?{" "}
            <Link href="/activar-cuenta" className="font-extrabold text-primary-deep">
              Activá tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
