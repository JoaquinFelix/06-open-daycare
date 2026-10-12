"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addChild } from "@/data/children";
import { ROOMS, type Room } from "@/data/rooms";
import { isFutureDate, parseDate } from "@/lib/child-form";

// El FormData puede traer un File o no traer la clave: sólo interesan strings.
function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isRoom(value: string): value is Room {
  return (ROOMS as readonly string[]).includes(value);
}

export async function createChild(formData: FormData) {
  const name = readText(formData, "name");
  const birthDate = readText(formData, "birthDate");
  const room = readText(formData, "room");
  const allergies = readText(formData, "allergies");
  const notes = readText(formData, "notes");

  const date = parseDate(birthDate);

  // Re-validación en servidor (defensa en profundidad): el cliente ya bloquea
  // estos casos, así que sólo se alcanza con un formData manipulado. Sin
  // errores en la UI (decisión del spec) se vuelve al formulario vacío.
  if (!name || !date || isFutureDate(date) || !isRoom(room)) {
    redirect("/kids/new");
  }

  addChild({
    name,
    birthDate,
    room,
    allergies: allergies || undefined,
    notes: notes || undefined,
  });

  // redirect() lanza una excepción de control: va después de revalidatePath y
  // fuera de cualquier try/catch.
  revalidatePath("/kids");
  redirect("/kids");
}
