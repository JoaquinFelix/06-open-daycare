export function KidNewModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/30 px-6 py-10">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-line bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]">
        {children}
      </div>
    </div>
  );
}