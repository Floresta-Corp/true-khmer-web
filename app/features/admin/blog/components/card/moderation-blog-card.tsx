import { Link } from "react-router";
import { Star } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { resolveBlogAuthor } from "~/lib/blog-author";
import { BLOG_STATUS_LABELS, BLOG_STATUS_STYLES } from "~/lib/blog-status";
import { formatDate } from "~/lib/time";
import type { BlogPostSummaryResponse } from "~/types/api-client";

interface ModerationBlogCardProps {
  post: BlogPostSummaryResponse;
  onFeature: () => void;
  onDelete: () => void;
}

export function ModerationBlogCard({
  post,
  onFeature,
  onDelete,
}: ModerationBlogCardProps) {
  const author = resolveBlogAuthor(post);
  const statusStyle = BLOG_STATUS_STYLES[post.status];
  const isPendingReview = post.status === "PENDING_REVIEW";

  return (
    <Card className="h-full min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-colors sm:p-5 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none dark:hover:border-slate-700">
      <div className="flex h-full min-w-0 flex-col gap-4 md:flex-row md:items-stretch">
        {post.coverImageUrl ? (
          <img
            src={post.coverImageUrl}
            alt={post.coverImageAlt || post.title}
            className="aspect-video w-full shrink-0 self-stretch rounded-xl object-cover md:aspect-auto md:h-auto md:min-h-44 md:w-56 xl:w-44 2xl:w-52"
          />
        ) : (
          <div className="flex aspect-video w-full shrink-0 flex-col items-center justify-center self-stretch rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center text-slate-400 md:aspect-auto md:h-auto md:min-h-44 md:w-56 xl:w-44 2xl:w-52 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-500">
            <div className="text-sm font-medium">No cover image</div>
            <div className="mt-1 text-xs">
              Add a hero image to improve the card preview.
            </div>
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="mb-2.5 flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`gap-1.5 rounded-lg px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${statusStyle.badge}`}
            >
              <span className={`size-1.5 rounded-full ${statusStyle.dot}`} />
              {BLOG_STATUS_LABELS[post.status]}
            </Badge>
            {post.categoryId ? (
              <Badge
                variant="outline"
                className="rounded-lg border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-bold tracking-wider text-amber-700 uppercase dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
              >
                {post.categoryName || "Unknown Category"}
              </Badge>
            ) : null}
            {post.isFeatured ? (
              <Badge
                variant="outline"
                className="rounded-lg border-blue-200 bg-blue-50 px-2 py-1 text-[10px] font-bold tracking-wider text-blue-700 uppercase dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
              >
                Featured on Blog
              </Badge>
            ) : null}
          </div>
          <h2
            className="line-clamp-2 text-xl leading-tight font-semibold break-words text-(--blog-secondary) sm:text-2xl dark:text-blue-300"
            title={post.title}
          >
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-300">
            {post.excerpt}
          </p>
          <div className="mt-3 text-sm break-words text-slate-500 dark:text-slate-400">
            {author.name}
            {post.author.name && post.author.name !== author.name
              ? ` (${post.author.name})`
              : ""}
            {" • "}
            {formatDate(post.publishedAt || post.updatedAt)}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              asChild
              variant={isPendingReview ? "default" : "ghost"}
              className={
                isPendingReview
                  ? "rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                  : "rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }
            >
              <Link to={`/tk-admin/khmer-voices/${post.id}`}>
                {isPendingReview ? "Review" : "View"}
              </Link>
            </Button>

            {post.status === "PUBLISHED" ? (
              post.isFeatured ? (
                // Featured is a state, not a disabled action — a greyed-out
                // button reads as "broken" rather than "already on".
                <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-2.5 text-sm font-medium text-white dark:bg-blue-500">
                  <Star className="size-4 fill-current" />
                  Featured
                </span>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50"
                  onClick={onFeature}
                >
                  <Star className="size-4" />
                  Set as Featured
                </Button>
              )
            ) : null}

            <Button
              type="button"
              variant="ghost"
              className="rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 dark:hover:text-rose-200"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
