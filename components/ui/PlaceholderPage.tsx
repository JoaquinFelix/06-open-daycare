import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import type { IconName } from "@/data/nav";

type PlaceholderPageProps = {
  title: string;
  icon: IconName;
  description?: string;
};

export function PlaceholderPage({
  title,
  icon,
  description = "Esta pantalla todavía no está implementada.",
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-[420px] rounded-[20px] border border-line bg-surface px-8 py-9 text-center shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-tint text-primary-strong">
          <Icon name={icon} size={26} />
        </div>

        <h1 className="mt-5 font-display text-[22px] font-semibold text-ink">
          {title}
        </h1>

        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">
          {description}
        </p>

        <div className="mt-5 inline-flex items-center rounded-full bg-tint px-4 py-2 text-[12px] font-extrabold tracking-[0.8px] text-primary-strong">
          EN CONSTRUCCIÓN
        </div>

        <div className="mt-7 border-t border-line-soft pt-5">
          <Link
            href="/"
            className="text-[14px] font-extrabold text-primary-deep hover:underline"
          >
            Volver al feed
          </Link>
        </div>
      </div>
    </div>
  );
}
