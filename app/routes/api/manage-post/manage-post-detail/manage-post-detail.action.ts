import type { Route } from "project-types/manage-post/routes/+types/manage-post.$sourceType.$id";
import { data } from "react-router";
import { requireAuthenticatedUser } from "~/lib/server/route-guards.server";
import {
  updateApplicantNote,
  updateApplicantStatus,
  updateManagePost,
  updateManagePostExtendDate,
} from "~/services/manage-post/server";
import {
  ApplicantStatusActionSchema,
  PostingSourceSchema,
  UpdateManagePostSchema,
  type ApplicantStatusAction,
  type PostSourceType,
  type PrivateNoteInput,
} from "~/services/manage-post/types";

export async function managePostDetailAction({
  request,
  params,
}: Route.ActionArgs) {
  await requireAuthenticatedUser(request);

  const sourceType = params.sourceType;
  const postingId = params.id;

  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();
  // const body = String(formData.get("body") ?? "").trim();
  // const method = request.method.toUpperCase();

  const allowedActionTypes = new Set([
    "postingAction",
    "note",
    "change-status",
    "extend-deadline",
  ]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return {
      ok: false,
      message: "Unsupported action.",
    };
  }

  const postingAction = formData.get("postingAction");

  if (actionType === "extend-deadline") {
    const deadline = String(formData.get("deadline") ?? "").trim();
    const sourceTypeResult = PostingSourceSchema.safeParse(sourceType);

    if (!sourceTypeResult.success || !postingId) {
      return data(
        { success: false, ok: false, error: "Invalid request parameters." },
        { status: 400 },
      );
    }

    if (!deadline || Number.isNaN(new Date(deadline).getTime())) {
      return data(
        { success: false, ok: false, error: "Please select a valid deadline." },
        { status: 400 },
      );
    }

    try {
      const result = await updateManagePostExtendDate(
        request,
        sourceTypeResult.data as PostSourceType,
        postingId,
        deadline,
      );

      return data({ success: true, ok: true, data: result });
    } catch (error: any) {
      return data(
        {
          success: false,
          ok: false,
          error: error?.message ?? "Unable to extend deadline.",
        },
        { status: error?.status ?? 500 },
      );
    }
  }

  // Handle candidate note update
  if (actionType === "note") {
    const candidateId = String(formData.get("candidateId") ?? "").trim();
    const sourceType = String(formData.get("sourceType") ?? "").trim();
    const postingId = String(formData.get("postingId") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!candidateId) {
      return data(
        { ok: false, message: "Candidate ID is required." },
        { status: 400 },
      );
    }

    if (!postingId) {
      return data(
        { ok: false, message: "Posting ID is required." },
        { status: 400 },
      );
    }

    const body: PrivateNoteInput = {
      note: note,
    };

    try {
      const res = await updateApplicantNote(
        request,
        sourceType as PostSourceType,
        postingId,
        candidateId,
        body,
      );

      if (res && res.data?.applicant?.privateNote) {
        return data({ success: true, ok: true });
      }

      return data({ success: false, ok: false }, { status: 400 });
    } catch (err) {
      return data(
        { success: false, ok: false, error: "An unexpected error occurred." },
        { status: 500 },
      );
    }
  }

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
