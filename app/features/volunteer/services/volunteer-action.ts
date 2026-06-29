import type { Route } from "project-types/volunteer/route/+types/volunteer";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  SaveVolunteerOpportunity,
  UnsaveVolunteerOpportunity,
} from "~/api/volunteer";

export async function volunteerAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType")?.toString();
  const opportunityId = formData.get("opportunityId")?.toString();

  if (!opportunityId) {
    return withAuthData(auth, {
      ok: false,
      message: "Invalid opportunity ID",
    });
  }

  try {
    if (actionType === "save-opportunity") {
      const result = await SaveVolunteerOpportunity(request, opportunityId);
      return withAuthData(
        auth,
        result?.data ?? { ok: false, message: "Unexpected response format" },
      );
    } else if (actionType === "unsave-opportunity") {
      const result = await UnsaveVolunteerOpportunity(request, opportunityId);
      return withAuthData(
        auth,
        result?.data ?? { ok: false, message: "Unexpected response format" },
      );
    }
    return withAuthData(auth, { ok: false, message: "Invalid action type" });
  } catch (error) {
    console.error("Volunteer action error:", error);
    return withAuthData(auth, {
      ok: false,
      message: "Failed to process request",
    });
  }
}
