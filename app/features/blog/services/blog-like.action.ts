import { setBlogPostLike } from "~/api/blog/blog-like.server";
import { transformActionResponse } from "~/lib/server/action-response.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import { BLOG_LIKE_ACTIONS } from "../types";

export async function blogLikeAction(request: Request, formData: FormData) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T) => withAuthData(auth, payload);

  const actionType = String(formData.get("actionType") ?? "").trim();
  const postId = String(formData.get("postId") ?? "").trim();
  if (!postId) {
    return respond({ ok: false, error: "Post ID is required." });
  }

  try {
    const result = await setBlogPostLike(
      requestWithSetCookie(request, auth.setCookie),
      postId,
      actionType === BLOG_LIKE_ACTIONS.like,
    );

    return withAuthData(
      { setCookie: result.setCookie ?? auth.setCookie },
      {
        ok: true,
        liked: result.data.liked,
        likeCount: result.data.likeCount,
      },
    );
  } catch (error) {
    return respond(transformActionResponse(error));
  }
}
