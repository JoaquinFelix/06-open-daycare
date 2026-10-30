import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { navItems } from "@/data/nav";
import { signOut } from "@/app/actions/auth";

type SidebarProps = {
  pathname: string;
  /** El drawer móvil debe cerrarse al seguir cualquier link */
  onNavigate?: () => void;
};

// Contenido del panel lateral. El <aside> o el drawer lo envuelve AppShell.
export function Sidebar({ pathname, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col px-4 py-6">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-[11px] pt-1 pr-2 pb-[22px] pl-2"
      >
        <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] text-white">
          <Icon name="sun" size={21} />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[17px] leading-none font-semibold text-ink">
            OpenDayCare
          </span>
          <span className="mt-0.5 block text-[11.5px] text-ink-muted">
            Sala Soles
          </span>
        </span>
      </Link>

      <Link
        href="/crear-publicacion"
        onClick={onNavigate}
        className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] p-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.75)]"
      >
        <Icon name="plus" size={17} />
        Nueva publicación
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          // /kids/mateo también resalta "Niños"; la raíz ("/") no es prefijo de nada.
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex items-center gap-3 rounded-xl bg-tint px-3 py-[11px] text-[14.5px] font-extrabold text-primary-strong"
                  : "flex items-center gap-3 rounded-xl px-3 py-[11px] text-[14.5px] font-semibold text-nav-idle hover:bg-tint/60"
              }
            >
              <Icon name={item.icon} size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-2.5 border-t border-line pt-3.5">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-accent font-display text-[16px] font-semibold text-white">
            C
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-extrabold text-ink">
              Caro Giménez
            </span>
            <span className="block text-[12px] text-ink-muted">
              Maestra · Soles
            </span>
          </span>
          <form action={signOut}>
            <button
              type="submit"
              title="Cerrar sesión"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-cream text-ink-soft hover:text-primary"
            >
              <Icon name="logout" size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
