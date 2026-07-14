import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.new";
import { createBlogPost } from "~/api/admin/blog/blog.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { parseBlogPostFormData } from "../lib/parse-blog-form-data";

export async function blogNewAction({ request }: Route.ActionArgs) {
  const { setCookie } = await requireAdmin(request);
  const formData = await request.formData();
  const payload = parseBlogPostFormData(formData);

  try {
    const result = await createBlogPost(request, payload);
    return redirect(
      `/tk-admin/blog/${result.data.post.id}?created=1`,
      result.setCookie ? { headers: { "Set-Cookie": result.setCookie } } : {},
    );
  } catch (err) {
    if (err instanceof ProtectedApiError) {
      return data(
        { ok: false, message: err.message, issues: err.details },
        {
          status: err.status,
          ...(setCookie ? { headers: { "Set-Cookie": setCookie } } : {}),
        },
      );
    }
    return data(
      { ok: false, message: "Failed to create blog post" },
      { status: 500 },
    );
  }
}
