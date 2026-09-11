import type { BlogPostStatus } from "~/lib/blog-status";

export const BLOG_QUEUE_PAGE_SIZE = 6;

/**
 * Statuses the moderation API accepts as a list filter. DRAFT is excluded:
 * drafts live only in the author's workspace and are never moderated.
 */
export const MODERATION_BLOG_STATUSES = [
  "PENDING_REVIEW",
  "PUBLISHED",
  "REJECTED",
  "UNPUBLISHED",
] as const satisfies readonly BlogPostStatus[];

/**
 * Statuses shown on the main blog library page. Pending submissions have their
 * own queue at /tk-admin/khmer-voices/review.
 */
export const BLOG_LIBRARY_STATUSES = [
  "PUBLISHED",
  "REJECTED",
  "UNPUBLISHED",
] as const satisfies readonly BlogPostStatus[];

export type BlogLibraryStatus = (typeof BLOG_LIBRARY_STATUSES)[number];

export const BLOG_MODERATION_INTENTS = {
  approve: "approve",
  reject: "reject",
  unpublish: "unpublish",
  feature: "feature",
  delete: "delete",
} as const;

export type BlogModerationIntent =
  (typeof BLOG_MODERATION_INTENTS)[keyof typeof BLOG_MODERATION_INTENTS];

export const BLOG_CATEGORY_INTENTS = {
  create: "createCategory",
  update: "updateCategory",
  toggleVisibility: "toggleCategoryVisibility",
} as const;

export type BlogCategoryIntent =
  (typeof BLOG_CATEGORY_INTENTS)[keyof typeof BLOG_CATEGORY_INTENTS];
