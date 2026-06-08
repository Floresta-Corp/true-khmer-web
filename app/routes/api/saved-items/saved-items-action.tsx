// saved-items-action.ts
import type { ActionFunctionArgs } from "react-router";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import {} from "~/services/saved-items/saved-items.server";
import {
  SaveVolunteerOpportunity,
  UnsaveVolunteerOpportunity,
} from "~/services/volunteer/server";

export async function savedItemsAction({ request }: ActionFunctionArgs) {
  const auth = await requireUser(request);

  const formData = await request.formData();
  const rawActionType = formData.get("actionType");
  const rawOpportunityId = formData.get("opportunityId");

  if (
    typeof rawActionType !== "string" ||
    !rawActionType ||
    typeof rawOpportunityId !== "string" ||
    !rawOpportunityId
  ) {
    return withAuthJson(
      auth,
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
      return withAuthJson(
        auth,
        { ok: false, error: "Unknown actionType" },
        { status: 400 },
      );
    }

    return withAuthJson(auth, { ok: true });
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
