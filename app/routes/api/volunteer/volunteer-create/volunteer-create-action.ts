import { redirect, type ActionFunctionArgs } from "react-router";
import { getUserId } from "~/lib/server/session.server";
import { createVolunteerOpportunity } from "~/services/volunteer/server/volunteer.opportunities.server";
import { VolunteerOpportunityInputSchema } from "~/services/volunteer/volunteer-types";

export async function volunteerCreateAction({ request }: ActionFunctionArgs) {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/login?redirectTo=/volunteer/create");
  }

  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "create-volunteer") {
    const dataStr = formData.get("data");

    if (!dataStr || typeof dataStr !== "string") {
      return { error: "Invalid form data" };
    }

    try {
      const data = JSON.parse(dataStr);
      const parsed = VolunteerOpportunityInputSchema.parse(data);
      const result = await createVolunteerOpportunity(request, parsed);

      if (result?.data?.opportunity?.id) {
        return {
          success: true,
          redirectTo: `/volunteer/detail/${result.data.opportunity.id}`,
        };
      }

      return { success: true, redirectTo: "/volunteer" };
    } catch (error) {
      console.error("Failed to create volunteer opportunity:", error);
      return { error: "Failed to create opportunity. Please try again." };
    }
  }

  if (actionType === "upload-cover-image") {
  }

  return { error: "Invalid action type" };
}
