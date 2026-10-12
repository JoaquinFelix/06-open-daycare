import type { Metadata } from "next";
import { LoginScreen } from "@/components/auth/LoginScreen";

export const metadata: Metadata = {
  title: "Iniciar sesión · OpenDayCare",
};

// Fuera del AppShell: el login no lleva sidebar.
export default function LoginPage() {
  return <LoginScreen />;
}
