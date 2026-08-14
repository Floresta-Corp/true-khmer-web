export const highlightAnswerClassName =
  "bg-sky-50/80 animate-pulse ease-in-out border-2 border-blue-200";

type SuspendablePost = {
  status: string;
  author: { id: string };
};

/**
 * True when the viewer is looking at their own suspended post.
 *
 * The API already hides suspended content from everyone but its author, so the
 * authorship check is belt-and-braces — but a moderation reason is not
 * something to render on the strength of an unexpected payload alone.
 */
export function isSuspendedForViewer(
  post: SuspendablePost | null | undefined,
  viewerId: string | null | undefined,
): boolean {
  if (!post || !viewerId) return false;
  return post.status === "SUSPENDED" && post.author.id === viewerId;
}
