import { redirect } from "react-router";
import type { Route } from "project-types/workspace/my-blog/route/+types/my-blog.$postId.edit";
import { transformActionResponse } from "~/lib/server/action-response.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { applyBlogPostIntent, parseBlogIntent } from "./my-blog-intent.server";

export async function myBlogEditAction({ request, params }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T, init?: ResponseInit) =>
    withAuthData(auth, payload, init);

  const postId = params.postId;
  if (!postId) {
    throw new Response("Blog post ID is required", { status: 400 });
  }

  const formData = await request.formData();
  const intent = parseBlogIntent(formData);
  if (!intent) {
    return respond({ ok: false, error: "Unknown action intent." });
  }

  try {
    const outcome = await applyBlogPostIntent(
      request,
      postId,
      intent,
      formData,
    );
    if (outcome.redirectTo) {
      throw redirect(outcome.redirectTo);
    }
    return respond({ ...outcome, intent });
  } catch (error) {
    if (error instanceof Response) throw error;
    return respond(transformActionResponse(error));
  }
}
