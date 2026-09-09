export const BLOG_COMMENT_SORTS = ["newest", "oldest"] as const;
export type BlogCommentSort = (typeof BLOG_COMMENT_SORTS)[number];

export interface BlogCommentViewer {
  id: string;
  name: string;
  avatarKey: string | null;
}

export const BLOG_COMMENT_ACTIONS = {
  create: "create-comment",
  update: "update-comment",
  delete: "delete-comment",
} as const;

export function parseBlogCommentSort(
  value: string | null | undefined,
): BlogCommentSort {
  return BLOG_COMMENT_SORTS.includes(value as BlogCommentSort)
    ? (value as BlogCommentSort)
    : "newest";
}
