import type { BlogPostSummaryResponse } from "~/types/api-client";

export const BLOG_TAG_LIMIT = 5;
export const MY_BLOG_PAGE_SIZE = 6;
export const BLOG_PREVIEW_STORAGE_KEY = "workspace.blog.preview";
export const BLOG_AUTOSAVE_STORAGE_PREFIX = "workspace.blog.autosave:";

export type MyBlogPostStatus = BlogPostSummaryResponse["status"];

export type MyBlogSortField =
  | "createdAt"
  | "updatedAt"
  | "publishedAt"
  | "title";

/**
 * The API only accepts edits (and therefore autosaves) while a post is in one
 * of these states; PENDING_REVIEW and PUBLISHED posts are frozen.
 */
export const EDITABLE_BLOG_STATUSES: MyBlogPostStatus[] = [
  "DRAFT",
  "REJECTED",
  "UNPUBLISHED",
];

export const MY_BLOG_ACTIONS = {
  save: "save",
  submit: "submit",
  withdraw: "withdraw",
  unpublish: "unpublish",
  delete: "delete",
} as const;

export type MyBlogActionType =
  (typeof MY_BLOG_ACTIONS)[keyof typeof MY_BLOG_ACTIONS];

export interface BlogPreviewDraft {
  title: string;
  excerpt: string;
  authorName: string;
  authorAvatarKey?: string | null;
  authorRole?: string;
  tags: string[];
  categoryName?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
  coverImageCaption?: string;
  content: string;
  previewDate: string;
  editorUrl?: string;
}

export function isEditableBlogStatus(status: MyBlogPostStatus) {
  return EDITABLE_BLOG_STATUSES.includes(status);
}
