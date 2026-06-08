import { type ActionFunctionArgs } from "react-router";
import { requireUser } from "~/lib/server/route-guards.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { transformActionResponse, mapZodError } from "~/lib/server/action-response.server";
import {
  createVolunteerOpportunity,
  uploadOpportunityCoverImage,
} from "~/services/volunteer/server/volunteer.opportunities.server";
import { VolunteerOpportunityInputSchema } from "~/services/volunteer/volunteer-types";

export async function volunteerCreateAction({ request }: ActionFunctionArgs) {
  await requireUser(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "create-volunteer") {
    const dataStr = formData.get("data");
    const file = formData.get("file");

    if (!dataStr || typeof dataStr !== "string") {
      return { ok: false, error: "Invalid form data" };
    }

    try {
      if (file && file instanceof File && file.size > 0) {
        const { data } = await uploadOpportunityCoverImage(request, {
          contentType: file.type,
          fileSize: file.size,
        });
        const upload = data.upload;
        if (!upload.uploadUrl)
          return { ok: false, error: "Failed to get upload URL" };

        const uploadResult = await fetch(upload.uploadUrl, {
          headers: upload.requiredHeaders,
          method: upload.method,
          body: file,
        });

        if (uploadResult.ok) {
          const parsed = JSON.parse(dataStr);
          parsed.coverImageKey = upload.coverImageKey;
          const validated = VolunteerOpportunityInputSchema.parse(parsed);
          const result = await createVolunteerOpportunity(request, validated);
          if (result?.data?.opportunity?.id) {
            return {
              ok: true,
              data: { redirectTo: `/volunteer/detail/${result.data.opportunity.id}` },
            };
          }
          return { ok: true, data: { redirectTo: "/volunteer" } };
        }
        return { ok: false, error: "Failed to upload cover image" };
      }

      const data = JSON.parse(dataStr);
      const parsed = VolunteerOpportunityInputSchema.parse(data);
      const result = await createVolunteerOpportunity(request, parsed);

      if (result?.data?.opportunity?.id) {
        return {
          ok: true,
          data: { redirectTo: `/volunteer/detail/${result.data.opportunity.id}` },
        };
      }

      return { ok: true, data: { redirectTo: "/volunteer" } };
    } catch (error) {
      if (error instanceof ProtectedApiError) {
        return transformActionResponse<{ redirectTo: string }>(error);
      }
      const zodMessage = mapZodError(error);
      if (zodMessage) {
        return { ok: false, error: zodMessage };
      }
      console.error("Failed to create volunteer opportunity:", error);
      return { ok: false, error: "Failed to create opportunity" };
    }
  }

  return { ok: false, error: "Invalid action type" };
}
