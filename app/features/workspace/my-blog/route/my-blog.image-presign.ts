import { presignMyBlogImage } from "~/api/blog/blog-post.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireUser } from "~/lib/server/route-guards.server";

interface PresignPayload {
  contentType: string;
  fileSize: number;
}

export async function action({ request }: { request: Request }) {
  await requireUser(request);

  let payload: PresignPayload;
  try {
    payload = (await request.json()) as PresignPayload;
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (!payload.contentType || !Number.isFinite(payload.fileSize)) {
    return Response.json(
      { ok: false, error: "contentType and fileSize are required" },
      { status: 400 },
    );
  }

  try {
    const result = await presignMyBlogImage(request, {
      contentType: payload.contentType,
      fileSize: payload.fileSize,
    });
    return Response.json(
      result.data,
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
      { ok: false, error: "Upload unavailable, try again." },
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
