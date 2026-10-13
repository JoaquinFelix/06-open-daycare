import { ROOMS, type Room } from "@/data/rooms";
import {
  ageLabelFrom,
  formatBirthDate,
  MONTHS_SHORT,
  parseDate,
  slugifyName,
} from "@/lib/child-form";

export type KidBadge = { label: string; variant: "allergy" | "link" };

export type ParentStatus = "active" | "pending";

export type Parent = {
  name: string;
  relation: string; // "Mamá" | "Papá"
  statusLabel: string; // "activa" | "invitación enviada"
  status: ParentStatus;
  initial: string;
  avatarBg: string;
};

export type Kid = {
  id: string; // "mateo" → /kids/mateo
  name: string;
  initial: string;
  ageLabel: string; // "3 años"
  parentsLabel: string; // "2 padres vinculados" | "sin padres vinculados"
  avatarBg: string;
  avatarFg: string;
  badge?: KidBadge;
  profile: {
    birthDate: string; // "12 mar 2022"
    room: string; // "Soles"
    joinedAt: string; // "feb 2025"
    allergyLabel?: string; // "MANÍ"
    allergyNote?: string;
    parents: Parent[];
  };
};

export type NewKidInput = {
  name: string; // "Martina López" — obligatorio, sin espacios sobrantes
  birthDate: string; // "dd/mm/aaaa" — obligatorio, fecha real y no futura
  room: Room; // obligatorio, uno de ROOMS
  allergies?: string; // "Maní, Lactosa" — opcional
  notes?: string; // "Indicaciones, medicación…" — opcional
};

export const PARENT_RELATIONS = ["Mamá", "Papá", "Tutor/a"] as const;
export type ParentRelation = (typeof PARENT_RELATIONS)[number];

export type NewParentInput = {
  kidId: string; // "mateo" — debe existir en getAllKids()
  name: string; // "Diego Fernández" — obligatorio, sin espacios sobrantes
  email: string; // "correo@ejemplo.com" — obligatorio, con formato válido
  relation: ParentRelation; // obligatorio, uno de PARENT_RELATIONS
};

export const kids: Kid[] = [
  {
    id: "mateo",
    name: "Mateo Fernández",
    initial: "M",
    ageLabel: "3 años",
    parentsLabel: "2 padres vinculados",
    avatarBg: "#A9D9E8",
    avatarFg: "#1F7A93",
    badge: { label: "MANÍ", variant: "allergy" },
    profile: {
      birthDate: "12 mar 2022",
      room: "Soles",
      joinedAt: "feb 2025",
      allergyLabel: "MANÍ",
      allergyNote:
        "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
      parents: [
        {
          name: "Lucía Fernández",
          relation: "Mamá",
          statusLabel: "activa",
          status: "active",
          initial: "L",
          avatarBg: "#C9B6E8",
        },
        {
          name: "Diego Fernández",
          relation: "Papá",
          statusLabel: "invitación enviada",
          status: "pending",
          initial: "D",
          avatarBg: "#A9C7E8",
        },
      ],
    },
  },
  {
    id: "sofia",
    name: "Sofía Méndez",
    initial: "S",
    ageLabel: "2 años",
    parentsLabel: "1 padre vinculado",
    avatarBg: "#F4B8CC",
    avatarFg: "#C44A7A",
    profile: {
      birthDate: "04 ago 2023",
      room: "Soles",
      joinedAt: "mar 2025",
      parents: [
        {
          name: "Paula Méndez",
          relation: "Mamá",
          statusLabel: "activa",
          status: "active",
          initial: "P",
          avatarBg: "#F2937A",
        },
      ],
    },
  },
  {
    id: "benjamin",
    name: "Benjamín Ruiz",
    initial: "B",
    ageLabel: "3 años",
    parentsLabel: "2 padres vinculados",
    avatarBg: "#B9DEC4",
    avatarFg: "#3E8B62",
    profile: {
      birthDate: "21 ene 2022",
      room: "Soles",
      joinedAt: "ene 2025",
      parents: [
        {
          name: "Mariana Ruiz",
          relation: "Mamá",
          statusLabel: "activa",
          status: "active",
          initial: "M",
          avatarBg: "#B9DEC4",
        },
        {
          name: "Pablo Ruiz",
          relation: "Papá",
          statusLabel: "activa",
          status: "active",
          initial: "P",
          avatarBg: "#A9C7E8",
        },
      ],
    },
  },
  {
    id: "valentina",
    name: "Valentina Soto",
    initial: "V",
    ageLabel: "2 años",
    parentsLabel: "sin padres vinculados",
    avatarBg: "#F4DC8E",
    avatarFg: "#9A7B1E",
    badge: { label: "VINCULAR", variant: "link" },
    profile: {
      birthDate: "30 nov 2023",
      room: "Soles",
      joinedAt: "abr 2025",
      parents: [],
    },
  },
  {
    id: "tomas",
    name: "Tomás Díaz",
    initial: "T",
    ageLabel: "3 años",
    parentsLabel: "1 padre vinculado",
    avatarBg: "#C9B6E8",
    avatarFg: "#7B5FC0",
    badge: { label: "LACTOSA", variant: "allergy" },
    profile: {
      birthDate: "08 may 2022",
      room: "Soles",
      joinedAt: "feb 2025",
      allergyLabel: "LACTOSA",
      allergyNote: "Intolerancia a la lactosa. Leche y yogur sin lactosa.",
      parents: [
        {
          name: "Verónica Díaz",
          relation: "Mamá",
          statusLabel: "activa",
          status: "active",
          initial: "V",
          avatarBg: "#C9B6E8",
        },
      ],
    },
  },
  {
    id: "emma",
    name: "Emma Castro",
    initial: "E",
    ageLabel: "2 años",
    parentsLabel: "1 padre vinculado",
    avatarBg: "#F4B8CC",
    avatarFg: "#C44A7A",
    profile: {
      birthDate: "16 jul 2023",
      room: "Soles",
      joinedAt: "abr 2025",
      parents: [
        {
          name: "Nicolás Castro",
          relation: "Papá",
          statusLabel: "activa",
          status: "active",
          initial: "N",
          avatarBg: "#A9C7E8",
        },
      ],
    },
  },
  {
    id: "lucas",
    name: "Lucas Romero",
    initial: "L",
    ageLabel: "3 años",
    parentsLabel: "1 padre vinculado",
    avatarBg: "#A9D9E8",
    avatarFg: "#1F7A93",
    profile: {
      birthDate: "02 sep 2022",
      room: "Soles",
      joinedAt: "ene 2025",
      parents: [
        {
          name: "Sofía Romero",
          relation: "Mamá",
          statusLabel: "activa",
          status: "active",
          initial: "S",
          avatarBg: "#F2937A",
        },
      ],
    },
  },
  {
    id: "olivia",
    name: "Olivia Vega",
    initial: "O",
    ageLabel: "2 años",
    parentsLabel: "1 padre vinculado",
    avatarBg: "#B9DEC4",
    avatarFg: "#3E8B62",
    profile: {
      birthDate: "19 abr 2023",
      room: "Soles",
      joinedAt: "mar 2025",
      parents: [
        {
          name: "Camila Vega",
          relation: "Mamá",
          statusLabel: "activa",
          status: "active",
          initial: "C",
          avatarBg: "#F2937A",
        },
      ],
    },
  },
];

// Store en memoria del proceso: sobrevive a las requests, no a reinicios.
const createdKids: Kid[] = [];

// Los 3 pares del seed, rotados por cantidad de niños creados.
const AVATAR_PALETTES: readonly (readonly [string, string])[] = [
  ["#A9D9E8", "#1F7A93"],
  ["#F4B8CC", "#C44A7A"],
  ["#B9DEC4", "#3E8B62"],
];

// Colores de avatar para padres nuevos, rotados por la cantidad que ya tiene el
// niño. El email no se persiste: no hay campo en `Parent` ni dónde mostrarlo.
const PARENT_AVATAR_COLORS: readonly string[] = [
  "#C9B6E8",
  "#A9C7E8",
  "#F2937A",
  "#B9DEC4",
];

function parentsLabelFrom(count: number): string {
  if (count === 0) return "sin padres vinculados";
  if (count === 1) return "1 padre vinculado";
  return `${count} padres vinculados`;
}

export function getAllKids(): Kid[] {
  return [...kids, ...createdKids];
}

// Agrupa por sala en orden ROOMS y descarta las salas sin niños.
export function kidsByRoom(): { room: Room; kids: Kid[] }[] {
  const all = getAllKids();

  return ROOMS.map((room) => ({
    room,
    kids: all.filter((kid) => kid.profile.room === room),
  })).filter((group) => group.kids.length > 0);
}

// "mateo" ya existe en el seed, así que un homónimo arranca en "mateo-2".
function uniqueId(base: string): string {
  const taken = new Set(getAllKids().map((kid) => kid.id));
  if (!taken.has(base)) return base;

  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}

export function addChild(input: NewKidInput): Kid {
  const name = input.name.trim().replace(/\s+/g, " ");
  const birthDate = parseDate(input.birthDate);
  if (!birthDate) {
    throw new Error(`Fecha de nacimiento inválida: ${input.birthDate}`);
  }

  const allergies = input.allergies?.trim();
  const notes = input.notes?.trim();
  const allergyLabel = allergies
    ? allergies.split(",")[0].trim().toUpperCase()
    : undefined;

  const [avatarBg, avatarFg] =
    AVATAR_PALETTES[createdKids.length % AVATAR_PALETTES.length];

  const now = new Date();

  const kid: Kid = {
    id: uniqueId(slugifyName(name)),
    name,
    initial: name.charAt(0).toUpperCase(),
    ageLabel: ageLabelFrom(birthDate),
    parentsLabel: parentsLabelFrom(0),
    avatarBg,
    avatarFg,
    // Sin alergias el aviso es "VINCULAR": el niño nace sin padres.
    badge: allergyLabel
      ? { label: allergyLabel, variant: "allergy" }
      : { label: "VINCULAR", variant: "link" },
    profile: {
      birthDate: formatBirthDate(birthDate),
      room: input.room,
      joinedAt: `${MONTHS_SHORT[now.getMonth()]} ${now.getFullYear()}`,
      allergyLabel,
      allergyNote: notes,
      parents: [],
    },
  };

  createdKids.push(kid);
  return kid;
}

export function addParent(input: NewParentInput): Parent | undefined {
  const kid = getKid(input.kidId);
  if (!kid) return undefined;

  const name = input.name.trim().replace(/\s+/g, " ");
  const { parents } = kid.profile;

  const parent: Parent = {
    name,
    relation: input.relation,
    statusLabel: "invitación enviada",
    status: "pending",
    initial: name.charAt(0).toUpperCase(),
    avatarBg: PARENT_AVATAR_COLORS[parents.length % PARENT_AVATAR_COLORS.length],
  };

  parents.push(parent);
  kid.parentsLabel = parentsLabelFrom(parents.length);

  // El niño ya no está "sin padres vinculados": el aviso VINCULAR deja de tener
  // sentido (no toca los badges de alergia).
  if (kid.badge?.variant === "link") kid.badge = undefined;

  return parent;
}

export function getKid(id: string): Kid | undefined {
  return getAllKids().find((kid) => kid.id === id);
}
