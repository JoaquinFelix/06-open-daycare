"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  addParent,
  getKid,
  PARENT_RELATIONS,
  type ParentRelation,
} from "@/data/children";
import { isValidEmail } from "@/lib/parent-invite";

// El FormData puede traer un File o no traer la clave: sólo interesan strings.
function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isRelation(value: string): value is ParentRelation {
  return (PARENT_RELATIONS as readonly string[]).includes(value);
}

export async function sendParentInvite(formData: FormData) {
  const kidId = readText(formData, "kidId");
  const name = readText(formData, "name");
  const email = readText(formData, "email");
  const relation = readText(formData, "relation");

  const kid = getKid(kidId);

  // kidId inexistente (formData manipulado): no hay dónde vincular.
  if (!kid) redirect("/kids");

  // Re-validación en servidor (defensa en profundidad): el cliente ya bloquea
  // estos casos, así que sólo se alcanza con un formData manipulado. Sin
  // errores en la UI (decisión del spec) se vuelve al formulario.
  if (!name || !isValidEmail(email) || !isRelation(relation)) {
    redirect(`/kids/${kid.id}/link-parent`);
  }

  addParent({ kidId: kid.id, name, email, relation });

  // redirect() lanza una excepción de control: va después de revalidatePath y
  // fuera de cualquier try/catch.
  revalidatePath("/kids");
  revalidatePath(`/kids/${kid.id}`);
  redirect(`/kids/${kid.id}`);
}
