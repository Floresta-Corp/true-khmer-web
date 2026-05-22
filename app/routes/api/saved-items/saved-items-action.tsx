import type { ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { setSavedItem } from "~/services/saved-items/saved-items.server";

export async function savedItemsAction({ request }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);

  const formData = await request.formData();
  const rawActionType = formData.get("actionType");
  const rawOpportunityId = formData.get("opportunityId");

  if (
    typeof rawActionType !== "string" ||
    !rawActionType ||
    typeof rawOpportunityId !== "string" ||
    !rawOpportunityId
  ) {
    return Response.json(
      { ok: false, error: "Missing or invalid actionType or opportunityId" },
      { status: 400 },
    );
  }

  const actionType: string = rawActionType;
  const opportunityId: string = rawOpportunityId;

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
