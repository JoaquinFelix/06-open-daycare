import { PlaceholderPage } from "@/components/ui/PlaceholderPage";

// Fuera del AppShell: el login no lleva sidebar.
export default function LoginPage() {
  return (
    <PlaceholderPage
      title="Iniciar sesión"
      icon="user"
      description="El login todavía no está implementado: no hay autenticación en esta etapa."
    />
  );
}
