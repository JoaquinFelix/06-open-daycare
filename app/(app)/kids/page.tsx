import { KidsHeader } from "@/components/kids/KidsHeader";
import { KidsList } from "@/components/kids/KidsList";
import { getAllKids } from "@/data/children";

export default async function KidsPage() {
  const items = getAllKids();

  return (
    <div className="mx-auto w-full max-w-[880px] px-10 pt-[34px] pb-20">
      <KidsHeader />
      <KidsList items={items} />
    </div>
  );
}
