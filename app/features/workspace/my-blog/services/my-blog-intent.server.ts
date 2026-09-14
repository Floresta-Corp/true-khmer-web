import {
  deleteMyBlogPost,
  submitMyBlogPost,
  unpublishMyBlogPost,
  updateMyBlogPost,
  withdrawMyBlogPost,
} from "~/api/blog/blog-post.server";
import { parseBlogPostFormData } from "../lib/parse-blog-form-data";
import { MY_BLOG_ACTIONS, type MyBlogActionType } from "../types";

export interface BlogIntentOutcome {
  ok: true;
  message: string;
  redirectTo?: string;
}

const INTENTS: MyBlogActionType[] = Object.values(MY_BLOG_ACTIONS);

export function parseBlogIntent(formData: FormData): MyBlogActionType | null {
  const intent = String(formData.get("intent") ?? "").trim();
  return INTENTS.includes(intent as MyBlogActionType)
    ? (intent as MyBlogActionType)
    : null;
}

/**
 * Runs one author intent against a post that already exists. `save` persists
 * the editor fields; the moderation intents are dedicated endpoints, so a
 * `submit` saves the latest edits first.
 */
export async function applyBlogPostIntent(
  request: Request,
  postId: string,
  intent: MyBlogActionType,
  formData: FormData,
): Promise<BlogIntentOutcome> {
  if (intent === MY_BLOG_ACTIONS.delete) {
    await deleteMyBlogPost(request, postId);
    return {
      ok: true,
      message: "Blog deleted successfully.",
      redirectTo: "/workspace/khmer-voices",
    };
  }

  if (intent === MY_BLOG_ACTIONS.withdraw) {
    await withdrawMyBlogPost(request, postId);
    return {
      ok: true,
      message: "Submission withdrawn. Your blog is a draft again.",
    };
  }

  if (intent === MY_BLOG_ACTIONS.unpublish) {
    const note = String(formData.get("note") ?? "").trim();
    await unpublishMyBlogPost(request, postId, note ? { note } : {});
    return { ok: true, message: "Blog unpublished." };
  }

  await updateMyBlogPost(request, postId, parseBlogPostFormData(formData));

  if (intent === MY_BLOG_ACTIONS.submit) {
    await submitMyBlogPost(request, postId);
    return { ok: true, message: "Blog submitted for review." };
  }

  return { ok: true, message: "Blog saved successfully." };
}
