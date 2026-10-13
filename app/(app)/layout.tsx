import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/AppShell";

export default function AppLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <AppShell>
      {children}
      {modal}
    </AppShell>
  );
}
