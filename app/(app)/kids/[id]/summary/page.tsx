import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { kids } from "@/data/children";

export const instant = false;

export async function generateStaticParams() {
  return kids.map((kid) => ({ id: kid.id }));
}

export default async function KidSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return <PlaceholderPage title="Resumen del día" icon="sun" />;
}
