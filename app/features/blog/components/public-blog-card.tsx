import { Link } from "react-router";
import { formatDate } from "~/lib/time";
import type { BlogPostListingItemResponse } from "~/types/api-client";

const FALLBACK_BLOG_IMAGE = "/images/hero-background-image.webp";

export function PublicBlogCard({
  post,
}: {
  post: BlogPostListingItemResponse;
}) {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-[#e2e8f0]/80 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:border-[#1c97d4]/30 dark:border-white/10 dark:bg-slate-950"
    >
      <div className="relative shrink-0 overflow-hidden rounded-t-[12px]">
        <img
          src={post.coverImageUrl || FALLBACK_BLOG_IMAGE}
          alt={post.coverImageAlt || post.title}
          loading="lazy"
          decoding="async"
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {post.isFeatured || post.categoryName ? (
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {post.isFeatured ? (
              <span className="inline-flex items-center rounded-full bg-[#1c97d4] px-4 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase shadow-sm">
                Featured
              </span>
            ) : null}
            {post.categoryName ? (
              <span className="inline-flex items-center rounded-full bg-white px-4 py-1 text-[10px] font-semibold tracking-[0.12em] text-[#1c97d4] uppercase shadow-sm">
                {post.categoryName}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-8 pt-8 pb-8">
        <div className="flex items-center gap-2 text-[14px] font-medium text-[#1c97d4]">
          <span>{post.authorName}</span>
          <span className="h-1 w-1 rounded-full bg-[#1c97d4]/70" />
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
        </div>
        <h2 className="mt-4 line-clamp-2 min-h-12.5 text-xl leading-tight font-semibold tracking-tight text-[#243d95] transition-colors group-hover:text-[#1c97d4] dark:text-slate-100">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 min-h-15 text-[14px] leading-5 text-slate-600 dark:text-slate-400">
          {post.previewText}
        </p>
      </div>
    </Link>
  );
}
