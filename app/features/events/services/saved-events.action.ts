import type { ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import { saveEvent, unsaveEvent } from "~/api/saved-items/saved-items.server";

/**
 * Save and unsave for Plumpi events, addressed by slug: the API reads the
 * event from Plumpi itself, so nothing about it is sent from the browser.
 * Shared by the events hub and the event detail page.
 */
export async function savedEventsAction({ request }: ActionFunctionArgs) {
  const auth = await requireUser(request);

  const formData = await request.formData();
  const intent = formData.get("intent");
  const slug = formData.get("slug");

  if (
    (intent !== "save" && intent !== "unsave") ||
    typeof slug !== "string" ||
    !slug
  ) {
    return withAuthJson(
      auth,
      { ok: false, error: "Missing or invalid intent or slug" },
      { status: 400 },
    );
  }

  try {
    const result =
      intent === "save"
        ? await saveEvent(request, slug)
        : await unsaveEvent(request, slug);

    return withAuthJson(auth, {
      ok: true,
      saved: result?.data?.saved ?? intent === "save",
    });
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return withAuthJson(
        auth,
        { ok: false, error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
