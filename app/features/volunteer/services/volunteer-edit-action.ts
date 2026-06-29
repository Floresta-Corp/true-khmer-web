import { type ActionFunctionArgs } from "react-router";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { transformActionResponse, mapZodError } from "~/lib/server/action-response.server";
import {
  updateVolunteerOpportunity,
  uploadOpportunityCoverImage,
} from "~/api/volunteer/volunteer.opportunities.server";
import { VolunteerOpportunityInputSchema } from "~/features/volunteer/types/volunteer-types";

export async function volunteerEditAction({
  request,
  params,
}: ActionFunctionArgs) {
  const id = params.id;
  if (!id) return { ok: false, error: "Missing opportunity id" };
  const auth = await requireUser(request);
  const formData = await request.formData();
  const actionType = formData.get("actionType");

  if (actionType === "update-volunteer") {
    const dataStr = formData.get("data");
    const file = formData.get("file");

    if (!dataStr || typeof dataStr !== "string") {
      return withAuthData(auth, { ok: false, error: "Invalid form data" });
    }

    try {
      if (file && file instanceof File && file.size > 0) {
        const { data } = await uploadOpportunityCoverImage(request, {
          contentType: file.type,
          fileSize: file.size,
        });
        const upload = data.upload;
        if (!upload.uploadUrl)
          return withAuthData(auth, {
            ok: false,
            error: "Failed to get upload URL",
          });

        const uploadResult = await fetch(upload.uploadUrl, {
          headers: upload.requiredHeaders,
          method: upload.method,
          body: file,
        });

        if (uploadResult.ok && uploadResult.status === 200) {
          const parsed = JSON.parse(dataStr);
          parsed.coverImageKey = upload.coverImageKey;
          const validated = VolunteerOpportunityInputSchema.parse(parsed);
          const result = await updateVolunteerOpportunity(request, id, validated);
          if (result?.data?.opportunity?.id) {
            return withAuthData(auth, {
              ok: true,
              data: { redirectTo: `/volunteer/detail/${result.data.opportunity.id}` },
            });
          }
          return withAuthData(auth, {
            ok: true,
            data: { redirectTo: "/volunteer" },
          });
        }
        return withAuthData(auth, {
          ok: false,
          error: "Failed to upload cover image",
        });
      }

      const data = JSON.parse(dataStr);
      const parsed = VolunteerOpportunityInputSchema.parse(data);
      const result = await updateVolunteerOpportunity(request, id, parsed);

      if (result?.data?.opportunity?.id) {
        return withAuthData(auth, {
          ok: true,
          data: { redirectTo: `/volunteer/detail/${result.data.opportunity.id}` },
        });
      }

      return withAuthData(auth, {
        ok: true,
        data: { redirectTo: "/volunteer" },
      });
    } catch (error) {
      if (error instanceof ProtectedApiError) {
        return withAuthData(
          auth,
          transformActionResponse<{ redirectTo: string }>(error),
        );
      }
      const zodMessage = mapZodError(error);
      if (zodMessage) {
        return withAuthData(auth, { ok: false, error: zodMessage });
      }
      console.error("Failed to update volunteer opportunity:", error);
      return withAuthData(auth, {
        ok: false,
        error: "Failed to update opportunity",
      });
    }
  }

  return withAuthData(auth, { ok: false, error: "Invalid action type" });
}
