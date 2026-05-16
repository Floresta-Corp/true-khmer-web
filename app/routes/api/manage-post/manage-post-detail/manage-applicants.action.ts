import type { Route } from "project-types/manage-post/routes/+types/manage-post.$sourceType.$id";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import { updateApplicantStatus } from "~/services/manage-post/server";
import type {
  ApplicantStatusAction,
  PostSourceType,
} from "~/services/manage-post/types";

export async function manageApplicantAction({
  request,
  params,
}: Route.ActionArgs) {
  await requireAuthenticatedUser(request);

  const sourceType = params.sourceType;
  const postingId = params.postingId;

  const formData = await request.formData();
  const applicationId = String(formData.get("applicationId") ?? "").trim();
  const statusAction = String(formData.get("statusAction") ?? "").trim();

  if (!applicationId || !statusAction) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    const result = await updateApplicantStatus(
      request,
      sourceType as PostSourceType,
      postingId,
      applicationId,
      statusAction as ApplicantStatusAction,
    );
    return { success: true, data: result };
  } catch (error: any) {
    if (error?.status === 409) {
      return { success: false, error: error?.details?.error };
    }
    throw error;
  }
}
