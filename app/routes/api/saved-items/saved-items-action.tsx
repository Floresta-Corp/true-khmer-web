import type { ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { setSavedItem } from "~/services/saved-items/saved-items.server";

export async function savedItemsAction({ request }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);

  const formData = await request.formData();
  const actionType = formData.get("actionType") as string;
  const opportunityId = formData.get("opportunityId") as string;

  const intent = actionType === "save-opportunity" ? "save" : "unsave";

  try {
    await setSavedItem(request, "volunteer", opportunityId, intent);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof ProtectedApiError) {
      return Response.json(
        { ok: false, error: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
