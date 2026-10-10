import { KidsHeader } from "@/components/kids/KidsHeader";
import { KidsSearch } from "@/components/kids/KidsSearch";

export default function KidsPage() {
  return (
    <div className="mx-auto w-full max-w-[880px] px-10 pt-[34px] pb-20">
      <KidsHeader />
      <KidsSearch />
    </div>
  );
}
