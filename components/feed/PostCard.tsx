import Link from "next/link";
import { Icon } from "@/components/ui/icons";
import { TagBadge } from "@/components/feed/TagBadge";
import type { FeedPost } from "@/data/feed";

// El niño lleva avatar azul claro; el anuncio, índigo con megáfono.
const AUTHOR_CLASSES = {
  child: "bg-[#A9D9E8] text-[#1F7A93]",
  anuncio: "bg-[#CCD8F4] text-[#4E72C8]",
} as const;

export function PostCard({ post }: { post: FeedPost }) {
  const { author } = post;
  const isAnnouncement = author.icon !== undefined;
  const avatarClasses = isAnnouncement
    ? AUTHOR_CLASSES.anuncio
    : AUTHOR_CLASSES.child;

  return (
    <article className="rounded-[20px] border border-line bg-surface px-[22px] py-5 shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
      <div className="mb-[14px] flex items-center gap-3">
        <span
          className={`flex h-11 w-11 flex-none items-center justify-center rounded-full font-display text-[17px] font-semibold ${avatarClasses}`}
        >
          {author.icon ? (
            <Icon name={author.icon} size={20} />
          ) : (
            author.initial
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="font-display text-[16.5px] font-semibold text-ink">
            {author.name}
          </div>
          <div className="text-[12.5px] text-ink-muted">
            {post.time} · {post.authorNote}
          </div>
        </div>

        <TagBadge tag={post.tag} />
      </div>

      <p className="mb-[10px] text-[12.5px] text-ink-muted">{post.audience}</p>
      <p className="text-[15.5px] leading-[1.55] text-ink-body">{post.body}</p>

      {post.photoLabel && (
        <Link
          href="/foto"
          className="mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
        >
          <Icon name="image" size={30} />
          <span className="text-[13.5px]">{post.photoLabel}</span>
        </Link>
      )}

      <div className="mt-4 flex items-center gap-[18px] border-t border-line-soft pt-[14px]">
        <span className="flex items-center gap-[7px] text-[14px] font-bold text-primary">
          <Icon name="heart" size={19} filled />
          {post.likes}
        </span>

        <Link
          href="/detalle-publicacion"
          className="flex items-center gap-[7px] text-[14px] font-bold text-ink-soft"
        >
          <Icon name="comment" size={18} />
          {post.comments}
        </Link>

        <span className="flex-1" />

        <Link
          href="/crear-publicacion"
          className="text-[14px] font-extrabold text-primary-deep"
        >
          Editar
        </Link>
      </div>
    </article>
  );
}
