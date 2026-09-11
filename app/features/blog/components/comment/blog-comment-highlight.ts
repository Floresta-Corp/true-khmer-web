export const highlightBlogCommentClassName =
  "bg-sky-50/80 animate-pulse ease-in-out border-2 border-blue-200";

export function getBlogCommentIdFromHash(hash: string): string | null {
  if (!hash.startsWith("#") || hash.length === 1) return null;

  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return null;
  }
}
