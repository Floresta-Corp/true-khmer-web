import type { BlogPostSummaryResponse } from "~/types/api-client";

export type BlogPostStatus = BlogPostSummaryResponse["status"];

export type BlogUnpublishReason = NonNullable<
  BlogPostSummaryResponse["moderation"]["unpublishReason"]
>;

export const BLOG_STATUS_LABELS: Record<BlogPostStatus, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending review",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
  UNPUBLISHED: "Unpublished",
};

export const BLOG_STATUS_STYLES: Record<
  BlogPostStatus,
  { badge: string; dot: string }
> = {
  DRAFT: {
    badge:
      "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300",
    dot: "bg-sky-500",
  },
  PENDING_REVIEW: {
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300",
    dot: "bg-amber-500",
  },
  PUBLISHED: {
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    badge:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300",
    dot: "bg-rose-500",
  },
  UNPUBLISHED: {
    badge:
      "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dot: "bg-slate-400",
  },
};

export const BLOG_UNPUBLISH_REASON_LABELS: Record<BlogUnpublishReason, string> =
  {
    AUTHOR_REQUEST: "Author request",
    POLICY_VIOLATION: "Policy violation",
    MODERATOR_DECISION: "Moderator decision",
    OUTDATED_CONTENT: "Outdated content",
  };
