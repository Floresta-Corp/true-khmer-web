import type { Route } from "project-types/workspace/my-blog/route/+types/my-blog";
import { transformActionResponse } from "~/lib/server/action-response.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { applyBlogPostIntent, parseBlogIntent } from "./my-blog-intent.server";

export async function myBlogAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T, init?: ResponseInit) =>
    withAuthData(auth, payload, init);

  const formData = await request.formData();
  const intent = parseBlogIntent(formData);
  const postId = String(formData.get("postId") ?? "").trim();

  if (!intent) {
    return respond({ ok: false, error: "Unknown action intent." });
  }
  if (!postId) {
    return respond({ ok: false, error: "Blog post ID is required." });
  }

  try {
    const outcome = await applyBlogPostIntent(
      request,
      postId,
      intent,
      formData,
    );
    return respond({ ...outcome, intent });
  } catch (error) {
    return respond(transformActionResponse(error));
  }
}
