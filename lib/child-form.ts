// Helpers puros del alta de niño (SPEC 04), compartidos por el cliente
// (máscara y validación mientras se escribe) y por la Server Action
// (re-validación en el servidor). No usan APIs de React ni de Next.

export const MONTHS_SHORT = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

// "12032020" → "12/03/2020". Sólo dígitos y máximo 8; las barras caen en las
// posiciones 2 y 5 del resultado y, si el texto es más corto, quedan al final
// (por eso "1" → "1/": el día sigue incompleto).
export function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4);

  return `${day ? `${day}/` : ""}${month ? `${month}/` : ""}${year}`;
}

// "12/03/2020" → Date. Devuelve null si el formato o el día/mes no existen.
export function parseDate(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

// Sólo se bloquea el futuro: hoy sigue siendo válida.
export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const probe = new Date(date);
  probe.setHours(0, 0, 0, 0);

  return probe.getTime() > today.getTime();
}

// 2022-03-12 → "12 mar 2022"
export function formatBirthDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  return `${day} ${MONTHS_SHORT[date.getMonth()]} ${date.getFullYear()}`;
}

// Edad completa respecto de hoy: "3 años" | "1 año"
export function ageLabelFrom(date: Date): string {
  const today = new Date();
  let years = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    years -= 1;
  }

  return `${years} ${years === 1 ? "año" : "años"}`;
}

// "Martina López" → "martina-lopez". El slug "new" choca con la ruta /kids/new.
export function slugifyName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug === "new" ? "nuevo" : slug;
}
