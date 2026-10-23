import { formatDateTime } from "~/lib/time";
import type { BlogPostResponse } from "~/types/api-client";
import { BLOG_UNPUBLISH_REASON_LABELS } from "~/lib/blog-status";

interface BlogModerationBannerProps {
  post?: BlogPostResponse;
}

export function BlogModerationBanner({ post }: BlogModerationBannerProps) {
  if (!post) return null;

  if (post.status === "REJECTED") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
        <p className="font-semibold">
          A moderator asked for changes
          {post.moderation.reviewedAt
            ? ` on ${formatDateTime(post.moderation.reviewedAt)}`
            : ""}
        </p>
        <p className="mt-1 leading-6">
          {post.moderation.rejectionReason ||
            "No reason was given. Update your blog and submit it again."}
        </p>
      </div>
    );
  }

  if (post.status === "UNPUBLISHED") {
    const reason = post.moderation.unpublishReason;
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
        <p className="font-semibold">
          This blog is off the public site
          {reason ? ` — ${BLOG_UNPUBLISH_REASON_LABELS[reason]}` : ""}
        </p>
        <p className="mt-1 leading-6">
          {post.moderation.unpublishNote ||
            "Edit your blog and submit it for review to publish it again."}
        </p>
      </div>
    );
  }

  return null;
}
