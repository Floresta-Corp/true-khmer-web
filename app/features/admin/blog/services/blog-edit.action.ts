import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.$postId.edit";
import { deleteBlogPost, updateBlogPost } from "~/api/admin/blog/blog.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { parseBlogPostFormData } from "../lib/parse-blog-form-data";

export async function blogEditAction({ request, params }: Route.ActionArgs) {
  const { setCookie } = await requireAdmin(request);
  const postId = params.postId;
  if (!postId) {
    throw new Response("Blog post ID is required", { status: 400 });
  }
  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  const formData = await request.formData();
  const intent = String(formData.get("intent") ?? "");

  try {
    if (intent === "delete") {
      await deleteBlogPost(request, postId);
      return redirect("/tk-admin/blog", cookieHeader);
    }

    const payload = parseBlogPostFormData(formData);
    await updateBlogPost(request, postId, payload);
    const message =
      payload.status === "PUBLISHED"
        ? "Blog published successfully."
        : payload.status === "ARCHIVED"
          ? "Blog unpublished successfully."
          : "Blog saved successfully.";
    return data({ ok: true, message, status: payload.status }, cookieHeader);
  } catch (err) {
    if (err instanceof ProtectedApiError) {
      return data(
        { ok: false, message: err.message, issues: err.details },
        { status: err.status, ...cookieHeader },
      );
    }
    return data(
      { ok: false, message: "Failed to update blog post" },
      { status: 500 },
    );
  }
}
