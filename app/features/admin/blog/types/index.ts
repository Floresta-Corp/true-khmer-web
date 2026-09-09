export const BLOG_QUEUE_PAGE_SIZE = 6;

export const BLOG_MODERATION_INTENTS = {
  approve: "approve",
  reject: "reject",
  unpublish: "unpublish",
  feature: "feature",
  delete: "delete",
} as const;

export type BlogModerationIntent =
  (typeof BLOG_MODERATION_INTENTS)[keyof typeof BLOG_MODERATION_INTENTS];
