import { data } from "react-router";
import type { Route } from "project-types/admin/blog/route/+types/blog";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import { applyBlogModerationIntent } from "./blog-moderation.server";

export async function blogAction({ request }: Route.ActionArgs) {
  const { setCookie } = await requireAdmin(request);
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
    );
    if (moderation) {
      return data(
        {
          ...moderation,
          intent,
          message: moderation.message ?? moderation.error,
        },
        moderation.ok ? cookieHeader : { status: 400 },
      );
    }

    return data(
      { ok: false, message: "Unknown action intent" },
      { status: 400 },
    );
  } catch (err) {
    if (err instanceof ProtectedApiError) {
      return data({ ok: false, message: err.message }, { status: err.status });
    }
    return data({ ok: false, message: "Action failed" }, { status: 500 });
  }
}
