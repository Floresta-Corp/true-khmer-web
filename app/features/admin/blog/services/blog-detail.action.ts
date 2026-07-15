import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.$postId";
import { deleteBlogPost } from "~/api/admin/blog/blog.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";

export async function blogDetailAction({ request, params }: Route.ActionArgs) {
  const { setCookie } = await requireAdmin(request);
  const postId = params.postId;
  if (!postId) {
    throw new Response("Blog post ID is required", { status: 400 });
  }
  const cookieHeader = setCookie
    ? { headers: { "Set-Cookie": setCookie } }
    : {};

  try {
    await deleteBlogPost(request, postId);
    return data(
      {
        ok: true,
        message: "Blog deleted successfully.",
        redirectTo: "/tk-admin/blog",
      },
      cookieHeader,
    );
  } catch (err) {
    if (err instanceof ProtectedApiError) {
      return data(
        { ok: false, message: err.message },
        { status: err.status, ...cookieHeader },
      );
    }
    return data(
      { ok: false, message: "Failed to delete blog post" },
      { status: 500 },
    );
  }
}
