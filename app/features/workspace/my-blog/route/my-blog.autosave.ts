import {
  createMyBlogPost,
  updateMyBlogPost,
} from "~/api/blog/blog-post.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { parseBlogPostFormData } from "../lib/parse-blog-form-data";

export async function action({ request }: { request: Request }) {
  await requireUser(request);

  const formData = await request.formData();
  const postId = formData.get("postId");
  const parsedPostId =
    typeof postId === "string" && postId ? postId : undefined;
  const payload = parseBlogPostFormData(formData);

  const hasMeaningfulPayload =
    payload.title !== "Untitled Draft" ||
    payload.excerpt?.trim() ||
    payload.content?.trim();
  if (!parsedPostId && !hasMeaningfulPayload) {
    return Response.json({ ok: true, skipped: true });
  }

  try {
    if (parsedPostId) {
      const result = await updateMyBlogPost(request, parsedPostId, payload);
      return Response.json(
        {
          ok: true,
          postId: result.data.post.id,
          status: result.data.post.status,
          updatedAt: result.data.post.updatedAt,
        },
        result.setCookie
          ? { headers: { "Set-Cookie": result.setCookie } }
          : undefined,
      );
    }

    const result = await createMyBlogPost(request, payload);
    return Response.json(
      {
        ok: true,
        postId: result.data.post.id,
        status: result.data.post.status,
        updatedAt: result.data.post.updatedAt,
        redirectTo: `/workspace/khmer-voices/${result.data.post.id}/edit`,
      },
      result.setCookie
        ? { headers: { "Set-Cookie": result.setCookie } }
        : undefined,
    );
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return Response.json(
        { ok: false, error: error.message },
        { status: error.status },
      );
    }
    return Response.json(
      { ok: false, error: "Autosave failed" },
      { status: 500 },
    );
  }
}

export async function loader() {
  return Response.json(
    { ok: false, error: "Method not allowed" },
    { status: 405 },
  );
}
