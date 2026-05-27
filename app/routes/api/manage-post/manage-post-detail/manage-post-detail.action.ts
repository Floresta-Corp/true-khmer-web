import type { Route } from "project-types/manage-post/routes/+types/manage-post.$sourceType.$id";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {
  updateApplicantStatus,
  updateManagePost,
} from "~/services/manage-post/server";
import {
  ApplicantStatusActionSchema,
  PostingSourceSchema,
  UpdateManagePostSchema,
  type ApplicantStatusAction,
  type PostSourceType,
} from "~/services/manage-post/types";

export async function managePostDetailAction({
  request,
  params,
}: Route.ActionArgs) {
  await requireAuthenticatedUser(request);

  const sourceType = params.sourceType;
  const postingId = params.id;

  const formData = await request.formData();
  const postingAction = formData.get("postingAction");
  const extendDateAction = formData.get("extend-deadline");

  // Handle posting-level actions (from ManagePostOption)
  if (postingAction) {
    const sourceTypeResult = PostingSourceSchema.safeParse(sourceType);
    const postingActionResult = UpdateManagePostSchema.safeParse(postingAction);

    if (
      !sourceTypeResult.success ||
      !postingActionResult.success ||
      !postingId
    ) {
      return { success: false, error: "Invalid request parameters" };
    }

    const result = await updateManagePost(
      request,
      sourceTypeResult.data as PostSourceType,
      postingId,
      postingActionResult.data,
    );
    return { success: true, data: result };
  }

  // handle extend deadline action (from Manage Post Option)

  // Handle applicant status actions (existing logic)
  const applicationId = String(formData.get("applicationId") ?? "").trim();
  const statusAction = String(formData.get("statusAction") ?? "").trim();

  if (!applicationId || !statusAction) {
    return { success: false, error: "Missing required fields" };
  }

  const sourceTypeResult = PostingSourceSchema.safeParse(sourceType);
  const statusActionResult =
    ApplicantStatusActionSchema.safeParse(statusAction);
  if (!sourceTypeResult.success || !statusActionResult.success || !postingId) {
    return { success: false, error: "Invalid request parameters" };
  }

  try {
    const result = await updateApplicantStatus(
      request,
      sourceTypeResult.data as PostSourceType,
      postingId,
      applicationId,
      statusActionResult.data as ApplicantStatusAction,
    );
    return { success: true, data: result };
  } catch (error: any) {
    if (error?.status === 409) {
      return { success: false, error: error?.details?.error };
    }
    throw error;
  }
}
