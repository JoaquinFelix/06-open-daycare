// Salas fijas de la guardería. Compartidas por el select del alta de niños
// (SPEC 04) y por el agrupado del listado /kids.
export const ROOMS = ["Soles", "Jardines", "Valles"] as const;

export type Room = (typeof ROOMS)[number];
