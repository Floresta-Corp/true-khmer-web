import {
  approveBlogPost,
  deleteBlogPost,
  rejectBlogPost,
  setBlogPostFeatured,
  unpublishBlogPost,
} from "~/api/admin/blog/blog.server";
import type { UnpublishBlogPostRequest } from "~/types/api-client";
import { BLOG_MODERATION_INTENTS, type BlogModerationIntent } from "../types";

const UNPUBLISH_REASONS: NonNullable<UnpublishBlogPostRequest["reason"]>[] = [
  "AUTHOR_REQUEST",
  "POLICY_VIOLATION",
  "MODERATOR_DECISION",
  "OUTDATED_CONTENT",
];

function readUnpublishReason(
  value: string,
): NonNullable<UnpublishBlogPostRequest["reason"]> {
  return UNPUBLISH_REASONS.includes(
    value as NonNullable<UnpublishBlogPostRequest["reason"]>,
  )
    ? (value as NonNullable<UnpublishBlogPostRequest["reason"]>)
    : "MODERATOR_DECISION";
}

/**
 * Runs the moderator decisions shared by the queue and the review page.
 * Returns `null` when the intent belongs to another handler (e.g. categories).
 */
export async function applyBlogModerationIntent(
  request: Request,
  intent: string,
  formData: FormData,
  postIdFromRoute?: string,
): Promise<{ ok: boolean; message?: string; error?: string } | null> {
  const knownIntent = Object.values(BLOG_MODERATION_INTENTS).includes(
    intent as BlogModerationIntent,
  );
  if (!knownIntent) return null;

  const postId =
    String(formData.get("postId") ?? "").trim() || postIdFromRoute || "";
  if (!postId) {
    return { ok: false, error: "Blog post ID is required." };
  }

  if (intent === BLOG_MODERATION_INTENTS.approve) {
    await approveBlogPost(request, postId);
    return { ok: true, message: "Blog approved and published." };
  }

  if (intent === BLOG_MODERATION_INTENTS.reject) {
    const reason = String(formData.get("reason") ?? "").trim();
    if (!reason) {
      return { ok: false, error: "A rejection reason is required." };
    }
    await rejectBlogPost(request, postId, { reason: reason.slice(0, 1000) });
    return { ok: true, message: "Blog rejected and sent back to the author." };
  }

  if (intent === BLOG_MODERATION_INTENTS.unpublish) {
    const note = String(formData.get("note") ?? "").trim();
    await unpublishBlogPost(request, postId, {
      reason: readUnpublishReason(String(formData.get("reason") ?? "")),
      ...(note ? { note: note.slice(0, 1000) } : {}),
    });
    return { ok: true, message: "Blog removed from the public site." };
  }

  if (intent === BLOG_MODERATION_INTENTS.feature) {
    const isFeatured = formData.get("isFeatured") === "true";
    await setBlogPostFeatured(request, postId, { isFeatured });
    return { ok: true, message: "Featured blog updated successfully." };
  }

  await deleteBlogPost(request, postId);
  return { ok: true, message: "Blog deleted successfully." };
}
