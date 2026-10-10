"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { KidCard } from "@/components/kids/KidCard";
import { kids, type Kid } from "@/data/children";

// Normaliza a minúsculas y sin acentos para que "SOFIA" matchee "Sofía".
function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function KidsSearch({ items = kids }: { items?: Kid[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = normalize(query);
    if (!term) return items;

    return items.filter((kid) => normalize(kid.name).includes(term));
  }, [items, query]);

  return (
    <>
      <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-line bg-surface px-4 py-3">
        <Icon name="search" size={18} className="flex-none text-[#B0A290]" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar niño…"
          className="min-w-0 flex-1 border-none bg-transparent text-[15px] text-ink outline-none placeholder:text-[#B6A99B]"
        />
      </div>

      <div className="mb-[14px] flex items-center gap-3">
        <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-ink">
          SALA SOLES
        </span>
        <span className="text-[13px] text-ink-muted">
          {filtered.length} {filtered.length === 1 ? "niño" : "niños"}
        </span>
        <span className="h-px flex-1 bg-rule" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-[#D8CBBA] bg-surface px-6 py-10 text-center">
          <p className="font-display text-[16px] font-semibold text-ink">
            No encontramos niños
          </p>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Probá con otro nombre.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2">
          {filtered.map((kid) => (
            <KidCard key={kid.id} kid={kid} />
          ))}
        </div>
      )}
    </>
  );
}
