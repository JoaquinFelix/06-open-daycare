import type { Metadata } from "next";
import { KidModalShell } from "@/components/kids/KidModalShell";
import { PostForm } from "@/components/feed/PostForm";
import { getKid } from "@/data/children";
import { createPost } from "@/app/(app)/crear-publicacion/actions";

export const metadata: Metadata = {
  title: "Nueva publicación · OpenDayCare",
};

const POST_KID_IDS = ["mateo", "sofia", "benjamin"] as const;

export default function InterceptedCrearPublicacionPage() {
  const kids = POST_KID_IDS.map((id) => getKid(id)).filter(
    (kid): kid is NonNullable<typeof kid> => kid !== undefined,
  );

  return (
    <KidModalShell maxWidth={580}>
      <PostForm action={createPost} kids={kids} />
    </KidModalShell>
  );
}
