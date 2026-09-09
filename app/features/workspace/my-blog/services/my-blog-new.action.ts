import { redirect } from "react-router";
import type { Route } from "project-types/workspace/my-blog/route/+types/my-blog.new";
import { createMyBlogPost } from "~/api/blog/blog-post.server";
import { transformActionResponse } from "~/lib/server/action-response.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { parseBlogPostFormData } from "../lib/parse-blog-form-data";
import { MY_BLOG_ACTIONS } from "../types";
import { applyBlogPostIntent, parseBlogIntent } from "./my-blog-intent.server";

export async function myBlogNewAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T, init?: ResponseInit) =>
    withAuthData(auth, payload, init);

  const formData = await request.formData();
  const intent = parseBlogIntent(formData) ?? MY_BLOG_ACTIONS.save;

  const existingPostId = String(formData.get("postId") ?? "").trim();

  try {
    // Autosave normally creates the draft (and redirects to its editor) first.
    // Reuse that draft when its id came along, and only create when a manual
    // save or submit beat the first autosave.
    const postId =
      existingPostId ||
      (await createMyBlogPost(request, parseBlogPostFormData(formData))).data
        .post.id;

    if (existingPostId || intent === MY_BLOG_ACTIONS.submit) {
      await applyBlogPostIntent(request, postId, intent, formData);
    }

    throw redirect(`/workspace/khmer-voices/${postId}/edit`);
  } catch (error) {
    if (error instanceof Response) throw error;
    return respond(transformActionResponse(error));
  }
}
