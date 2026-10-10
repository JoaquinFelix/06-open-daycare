import { PlaceholderPage } from "@/components/ui/PlaceholderPage";
import { kids } from "@/data/children";

export const instant = false;

export async function generateStaticParams() {
  return kids.map((kid) => ({ id: kid.id }));
}

export default async function LinkParentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return <PlaceholderPage title="Vincular otro padre" icon="user" />;
}
