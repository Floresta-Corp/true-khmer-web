import { data, redirect } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog.$postId";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { BLOG_MODERATION_INTENTS } from "../types";
import { applyBlogModerationIntent } from "./blog-moderation.server";

export async function blogDetailAction({ request, params }: Route.ActionArgs) {
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
    const moderation = await applyBlogModerationIntent(
      request,
      intent,
      formData,
      postId,
    );

    if (!moderation) {
      return data(
        { ok: false, message: "Unknown action intent" },
        { status: 400 },
      );
    }

    if (!moderation.ok) {
      return data(
        { ok: false, message: moderation.error },
        { status: 400, ...cookieHeader },
      );
    }

    if (intent === BLOG_MODERATION_INTENTS.delete) {
      return redirect("/tk-admin/blog", cookieHeader);
    }

    return data(
      { ok: true, message: moderation.message, intent },
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
      { ok: false, message: "Moderation action failed" },
      { status: 500 },
    );
  }
}
