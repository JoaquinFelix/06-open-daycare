import type { Metadata } from "next";
import { KidModalShell } from "@/components/kids/KidModalShell";
import { PostForm } from "@/components/feed/PostForm";
import { getKid } from "@/data/children";
import { createPost } from "./actions";

export const metadata: Metadata = {
  title: "Nueva publicación · OpenDayCare",
};

// Los 3 niños del mockup crear-publicacion.dc.html
const POST_KID_IDS = ["mateo", "sofia", "benjamin"] as const;

export default function CrearPublicacionPage() {
  const kids = POST_KID_IDS.map((id) => getKid(id)).filter(
    (kid): kid is NonNullable<typeof kid> => kid !== undefined,
  );

  return (
    <KidModalShell maxWidth={580}>
      <PostForm action={createPost} kids={kids} />
    </KidModalShell>
  );
}
