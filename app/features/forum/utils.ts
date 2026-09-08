import { ForumQuestionImagePresignInputSchema } from "~/features/forum/types";

export const highlightAnswerClassName =
  "bg-sky-50/80 animate-pulse ease-in-out border-2 border-blue-200";

type SuspendablePost = {
  status: string;
  author: { id: string };
};

export function isSuspendedForViewer(
  post: SuspendablePost | null | undefined,
  viewerId: string | null | undefined,
): boolean {
  if (!post || !viewerId) return false;
  return post.status === "SUSPENDED" && post.author.id === viewerId;
}

export function validateQuestionImageFile(file: File): string | null {
  if (file.size === 0) return "That image file is empty.";

  const parsed = ForumQuestionImagePresignInputSchema.safeParse({
    contentType: file.type,
    fileSize: file.size,
  });
  if (parsed.success) return null;

  return parsed.error.issues[0]?.message ?? "That image cannot be uploaded.";
}
