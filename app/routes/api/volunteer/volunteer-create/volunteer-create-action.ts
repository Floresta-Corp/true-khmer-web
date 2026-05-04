import { type ActionFunctionArgs } from "react-router";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
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
    const file = formData.get("file");

    if (!dataStr || typeof dataStr !== "string") {
      return { error: "Invalid form data" };
    }

    let coverImageKey: string | undefined;

    if (file && file instanceof File && file.size > 0) {
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
            coverImageKey = upload.coverImageKey;
          } else {
            return { error: "Failed to upload cover image" };
          }
        } catch (uploadError) {
          console.error("Failed to upload cover image:", uploadError);
          return { error: "Failed to upload cover image" };
        }
      } catch (error) {
        console.error("Failed to upload cover image:", error);
        return { error: "Failed to upload cover image" };
      }
    }

    try {
      const data = JSON.parse(dataStr);
      if (coverImageKey) {
        data.coverImageKey = coverImageKey;
      }

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
      if (error instanceof ProtectedApiError) {
        const details = error.details as { error?: { message?: string } } | undefined;
        if (details?.error?.message) {
          try {
            const parsedErrors = JSON.parse(details.error.message);
            if (Array.isArray(parsedErrors) && parsedErrors.length > 0) {
              const firstError = parsedErrors[0];
              return { error: firstError.message };
            }
          } catch {
            return { error: error.message || "Failed to create opportunity" };
          }
        }
        return { error: error.message || "Failed to create opportunity" };
      }
      console.error("Failed to create volunteer opportunity:", error);
      return { error: "Failed to create opportunity" };
    }
  }

  return { error: "Invalid action type" };
}
