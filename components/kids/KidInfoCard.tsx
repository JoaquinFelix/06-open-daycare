type InfoRow = { label: string; value: string };

// Ficha del niño: filas etiqueta/valor separadas por línea.
export function KidInfoCard({ rows }: { rows: InfoRow[] }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-line bg-surface">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex justify-between px-[18px] py-[15px] ${
            index < rows.length - 1 ? "border-b border-line-soft" : ""
          }`}
        >
          <span className="text-[14.5px] text-ink-soft">{row.label}</span>
          <span className="text-[14.5px] font-extrabold text-ink">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
