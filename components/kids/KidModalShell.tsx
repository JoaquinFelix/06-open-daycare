// Overlay a pantalla completa con la tarjeta centrada. `maxWidth` distingue
// las tarjetas del proyecto: 520px para "Agregar niño", 480px para "Vincular
// padre" (references/pantallas/vincular-padre.dc.html).
export function KidModalShell({
  maxWidth = 520,
  children,
}: {
  maxWidth?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/30 px-6 py-10">
      <div
        className="w-full overflow-hidden rounded-[24px] border border-line bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
