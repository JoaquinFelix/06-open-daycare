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

export function getKid(id: string): Kid | undefined {
  return kids.find((kid) => kid.id === id);
}
