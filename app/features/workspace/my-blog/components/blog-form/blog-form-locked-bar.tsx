import { Lock } from "lucide-react";
import { formatDateTime } from "~/lib/time";
import { cn } from "~/lib/utils";
import type { BlogPostResponse } from "~/types/api-client";

interface BlogFormLockedBarProps {
  post?: BlogPostResponse;
}

function getLockedCopy(post?: BlogPostResponse) {
  if (post?.status === "PENDING_REVIEW") {
    const submittedAt = post.moderation.submittedAt;
    return {
      title: submittedAt
        ? `In review · Submitted ${formatDateTime(submittedAt)}`
        : "In review",
      description:
        "Editing is paused while moderators review your blog. Withdraw the submission to make changes.",
      tone: "amber" as const,
    };
  }

  if (post?.status === "PUBLISHED") {
    return {
      title: post.publishedAt
        ? `Published ${formatDateTime(post.publishedAt)}`
        : "Published",
      description:
        "Live blogs are read-only. Unpublish it first if you need to make changes.",
      tone: "emerald" as const,
    };
  }

  return {
    title: "Read-only",
    description: "This blog can't be edited in its current status.",
    tone: "slate" as const,
  };
}

const TONE_STYLES = {
  amber: {
    bar: "border-amber-200 bg-amber-50/95 dark:border-amber-900/60 dark:bg-amber-950/80",
    icon: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    title: "text-amber-900 dark:text-amber-100",
    description: "text-amber-800/80 dark:text-amber-200/80",
  },
  emerald: {
    bar: "border-emerald-200 bg-emerald-50/95 dark:border-emerald-900/60 dark:bg-emerald-950/80",
    icon: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    title: "text-emerald-900 dark:text-emerald-100",
    description: "text-emerald-800/80 dark:text-emerald-200/80",
  },
  slate: {
    bar: "border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95",
    icon: "bg-slate-500/10 text-slate-600 dark:text-slate-300",
    title: "text-slate-900 dark:text-slate-100",
    description: "text-slate-600 dark:text-slate-400",
  },
};

/**
 * Takes the editor toolbar's slot while the blog is locked, so the sticky
 * header keeps its height and the reason stays visible while scrolling.
 */
export function BlogFormLockedBar({ post }: BlogFormLockedBarProps) {
  const copy = getLockedCopy(post);
  const tone = TONE_STYLES[copy.tone];

  return (
    <div
      role="status"
      className={cn(
        "flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-2 shadow-sm backdrop-blur dark:shadow-none",
        tone.bar,
      )}
    >
      <span
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          tone.icon,
        )}
      >
        <Lock className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 text-sm">
        <p className={cn("font-semibold", tone.title)}>{copy.title}</p>
        <p className={cn("leading-5", tone.description)}>{copy.description}</p>
      </div>
    </div>
  );
}
