// saved-items-action.ts
import type { ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {} from "~/services/saved-items/saved-items.server";
import {
  SaveVolunteerOpportunity,
  UnsaveVolunteerOpportunity,
} from "~/services/volunteer/server";

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

  try {
    if (rawActionType === "save-opportunity") {
      await SaveVolunteerOpportunity(request, rawOpportunityId);
    } else if (rawActionType === "unsave-opportunity") {
      await UnsaveVolunteerOpportunity(request, rawOpportunityId);
    } else {
      return Response.json(
        { ok: false, error: "Unknown actionType" },
        { status: 400 },
      );
    }

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
