"use server";

import { redirect } from "next/navigation";

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

export async function createPost(formData: FormData) {
  const recipients = readAllText(formData, "recipients");
  const description = readText(formData, "description");

  // Re-validación en servidor (defensa en profundidad): el cliente ya bloquea
  // estos casos, así que sólo se alcanza con un formData manipulado. Sin
  // errores en la UI se vuelve al feed.
  if (recipients.length === 0 || !description) {
    redirect("/crear-publicacion");
  }

  // Sin persistencia en este spec: el formulario sólo valida y vuelve al feed.
  // redirect() lanza una excepción de control: va fuera de try/catch.
  redirect("/");
}
