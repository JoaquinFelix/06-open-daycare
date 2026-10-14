import { Composer } from "@/components/feed/Composer";
import { FeedHeader } from "@/components/feed/FeedHeader";
import { PostCard } from "@/components/feed/PostCard";
import { getAllFeedPosts } from "@/data/feed";

export default function FeedPage() {
  return (
    <div className="mx-auto w-full max-w-[760px] px-10 pt-[34px] pb-20">
      <FeedHeader />

      <Composer />

      <div className="mb-[14px] flex items-center gap-[14px]">
        <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-label">
          PUBLICADO HOY
        </span>
        <span className="h-px flex-1 bg-rule" />
      </div>

      <div className="flex flex-col gap-4">
        {getAllFeedPosts().map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
