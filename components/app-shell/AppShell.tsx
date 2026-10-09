"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/app-shell/Sidebar";
import { Icon } from "@/components/ui/icons";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="sticky top-0 hidden h-screen w-[248px] flex-none border-r border-line bg-surface md:flex">
        <Sidebar pathname={pathname} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[60px] flex-none items-center justify-between gap-3 border-b border-line bg-surface px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)] text-white">
              <Icon name="sun" size={17} />
            </span>
            <span className="font-display text-[15px] font-semibold text-ink">
              OpenDayCare
            </span>
          </Link>

          <button
            type="button"
            aria-label="Abrir menú"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-cream text-ink-soft"
          >
            <Icon name="menu" size={20} />
          </button>
        </header>

        <main className="min-w-0 flex-1 md:h-screen md:overflow-y-auto">
          {children}
        </main>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink/30"
          />
          <div className="absolute top-0 left-0 h-full w-[280px] border-r border-line bg-surface shadow-xl">
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setDrawerOpen(false)}
              className="absolute top-5 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-[10px] bg-cream text-ink-soft"
            >
              <Icon name="close" size={16} />
            </button>
            <Sidebar pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
