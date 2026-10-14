"use server";

import { redirect } from "next/navigation";
import { addPost, type FeedTag } from "@/data/feed";
import { getKid } from "@/data/children";

const ALL_ROOM = "toda-sala";

const POST_TYPE_IDS = [
  "comida",
  "siesta",
  "actividad",
  "logro",
  "animo",
  "foto",
  "anuncio",
] as const;

function isPostType(value: string): value is FeedTag {
  return (POST_TYPE_IDS as readonly string[]).includes(value);
}

// El FormData puede traer un File o no traer la clave: sólo interesan strings.
function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readAllText(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

// "toda-sala" → "Para: toda la sala"; ["mateo","sofia"] → "Para: familia de Mateo, Sofía"
function audienceFrom(recipients: string[]): string {
  if (recipients.includes(ALL_ROOM)) return "Para: toda la sala";

  const names = recipients
    .map((id) => getKid(id)?.name.split(" ")[0])
    .filter((name): name is string => name !== undefined);

  return `Para: familia de ${names.join(", ")}`;
}

export async function createPost(formData: FormData) {
  const recipients = readAllText(formData, "recipients");
  const type = readText(formData, "type");
  const description = readText(formData, "description");

  // Re-validación en servidor (defensa en profundidad): el cliente ya bloquea
  // estos casos, así que sólo se alcanza con un formData manipulado. Sin
  // errores en la UI se vuelve al feed.
  if (recipients.length === 0 || !description) {
    redirect("/crear-publicacion");
  }

  addPost({
    tag: isPostType(type) ? type : "actividad",
    audience: audienceFrom(recipients),
    body: description,
  });

  // redirect() lanza una excepción de control: va fuera de try/catch.
  redirect("/");
}
