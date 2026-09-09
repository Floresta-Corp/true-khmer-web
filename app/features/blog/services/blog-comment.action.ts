import type { Route } from "project-types/blog/route/+types/blog.$slug";
import {
  createBlogComment,
  deleteBlogComment,
  updateBlogComment,
} from "~/api/blog/blog-comment.server";
import { transformActionResponse } from "~/lib/server/action-response.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { BLOG_COMMENT_ACTIONS } from "../types";

export async function blogCommentAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T, init?: ResponseInit) =>
    withAuthData(auth, payload, init);

  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  const postId = String(formData.get("postId") ?? "").trim();
  const commentId = String(formData.get("commentId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const replyToComment =
    String(formData.get("replyToComment") ?? "").trim() || null;

  try {
    if (actionType === BLOG_COMMENT_ACTIONS.create) {
      if (!postId) {
        return respond({ ok: false, error: "Post ID is required." });
      }
      if (!body) {
        return respond({ ok: false, error: "Comment cannot be empty." });
      }

      const result = await createBlogComment(request, {
        postId,
        body,
        replyToComment,
      });

      return respond({
        ok: true,
        message: replyToComment ? "Reply posted." : "Comment posted.",
        comment: result.data.comment,
      });
    }

    if (actionType === BLOG_COMMENT_ACTIONS.update) {
      if (!commentId) {
        return respond({ ok: false, error: "Comment ID is required." });
      }
      if (!body) {
        return respond({ ok: false, error: "Comment cannot be empty." });
      }

      const result = await updateBlogComment(request, commentId, { body });

      return respond({
        ok: true,
        message: "Comment updated.",
        comment: result.data.comment,
      });
    }

    if (actionType === BLOG_COMMENT_ACTIONS.delete) {
      if (!commentId) {
        return respond({ ok: false, error: "Comment ID is required." });
      }

      await deleteBlogComment(request, commentId);

      return respond({ ok: true, message: "Comment deleted." });
    }

    return respond({ ok: false, error: "Unsupported action." });
  } catch (error) {
    return respond(transformActionResponse(error));
  }
}
