import type { Metadata } from "next";
import { ActivateAccountScreen } from "@/components/auth/ActivateAccountScreen";

export const metadata: Metadata = {
  title: "Activar cuenta · OpenDayCare",
};

// Fuera del AppShell: la activación no lleva sidebar.
export default function ActivateAccountPage() {
  return <ActivateAccountScreen />;
}
