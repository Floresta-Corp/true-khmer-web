import { type ActionFunctionArgs } from "react-router";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {
  createVolunteerOpportunity,
  uploadOpportunityCoverImage,
} from "~/services/volunteer/server/volunteer.opportunities.server";
import { VolunteerOpportunityInputSchema } from "~/services/volunteer/volunteer-types";

export async function volunteerCreateAction({ request }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);
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
    const file = formData.get("file") as File | null;

    if (!file || !(file instanceof File)) {
      return { error: "File is required" };
    }

    try {
      const { data } = await uploadOpportunityCoverImage(request, {
        contentType: file.type,
        fileSize: file.size,
      });
      const upload = data.upload;
      if (!upload.uploadUrl) return { error: "Failed to get upload URL" };
      try {
        const uploadResult = await fetch(upload.uploadUrl, {
          headers: upload.requiredHeaders,
          method: upload.method,
          body: file,
        });
        if (uploadResult.ok && uploadResult.status === 200) {
          return { coverImageKey: upload.coverImageKey };
        }
        const errorText = await uploadResult.text();
        console.error("Upload failed:", uploadResult.status, errorText);
        return { error: "Failed to upload cover image" };
      } catch (uploadError) {
        console.error("Failed to upload cover image:", uploadError);
        return { error: "Failed to upload cover image" };
      }
    } catch (error) {
      console.error("Failed to upload cover image:", error);
      return { error: "Failed to upload cover image" };
    }
  }
  return { error: "Invalid action type" };
}
