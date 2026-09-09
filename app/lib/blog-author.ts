import type { BlogPostAuthor } from "~/types/api-client";

export interface ResolvedBlogAuthor {
  name: string;
  /** Set only when the byline comes from the joined account. */
  avatarKey: string | null;
  /** Account id, for profile links, when a member wrote the blog. */
  id: string | null;
  role: string | null;
}

interface BlogPostAuthorFields {
  authorName?: string | null;
  authorRole?: string | null;
  author?: BlogPostAuthor | null;
}

/**
 * Blogs written before authoring moved into the workspace carry a typed-in
 * `authorName`, which stays the byline. Blogs written by a member leave it
 * empty, and the API joins that member's name and avatar in `author`.
 */
export function resolveBlogAuthor(
  post: BlogPostAuthorFields,
): ResolvedBlogAuthor {
  const role = post.authorRole?.trim() || null;
  const typedName = post.authorName?.trim();

  if (typedName) {
    return { name: typedName, avatarKey: null, id: null, role };
  }

  return {
    name: post.author?.name?.trim() || "Unknown author",
    avatarKey: post.author?.avatarKey ?? null,
    id: post.author?.id ?? null,
    role,
  };
}
