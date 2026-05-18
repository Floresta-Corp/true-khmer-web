import type { Route } from "project-types/volunteer/routes/+types/volunteer";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {
  SaveVolunteerOpportunity,
  UnsaveVolunteerOpportunity,
} from "~/services/volunteer/server";

export async function volunteerAction({ request }: Route.ActionArgs) {
  await requireAuthenticatedUser(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType")?.toString();
  const opportunityId = formData.get("opportunityId")?.toString();

  if (!opportunityId) {
    return {
      ok: false,
      message: "Invalid opportunity ID",
    };
  }

  try {
    if (actionType === "save-opportunity") {
      const result = await SaveVolunteerOpportunity(request, opportunityId);
      return result?.data ?? { ok: false, message: "Unexpected response format" };
    } else if (actionType === "unsave-opportunity") {
      const result = await UnsaveVolunteerOpportunity(request, opportunityId);
      return result?.data ?? { ok: false, message: "Unexpected response format" };
    }
    return { ok: false, message: "Invalid action type" };
  } catch (error) {
    console.error("Volunteer action error:", error);
    return { ok: false, message: "Failed to process request" };
  }
}
