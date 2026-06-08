import type { Route } from "project-types/manage-post/routes/+types/manage-post.$sourceType.$id";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  declineApplicantStatus,
  updateApplicantNote,
  updateApplicantStatus,
  updateManagePost,
} from "~/services/manage-post/server";
import {
  ApplicantStatusActionSchema,
  PostingSourceSchema,
  UpdateManagePostSchema,
  type ApplicantStatusAction,
  type PostSourceType,
  type PrivateNoteInput,
} from "~/services/manage-post/types";

export type DeclineApplicantParams = {
  declineAll?: boolean;
  blockFutureApply?: boolean;
};

export async function managePostDetailAction({
  request,
  params,
}: Route.ActionArgs) {
  const auth = await requireUser(request);
  const respond = <T>(payload: T, init?: ResponseInit) =>
    withAuthData(auth, payload, init);

  const sourceType = params.sourceType;
  const postingId = params.id;

  const formData = await request.formData();
  const actionType = String(formData.get("actionType") ?? "").trim();

  const allowedActionTypes = new Set(["note", "change-status", "decline"]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return respond({
      ok: false,
      message: "Unsupported action.",
    });
  }

  const postingAction = formData.get("postingAction");

  // Handle candidate note update
  if (actionType === "note") {
    const candidateId = String(formData.get("candidateId") ?? "").trim();
    const sourceType = String(formData.get("sourceType") ?? "").trim();
    const postingId = String(formData.get("postingId") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!candidateId) {
      return respond(
        { ok: false, message: "Candidate ID is required." },
        { status: 400 },
      );
    }

    if (!postingId) {
      return respond(
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
        return respond({ success: true, ok: true });
      }

      return respond({ success: false, ok: false }, { status: 400 });
    } catch (err) {
      return respond(
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
      return respond({ success: false, error: "Invalid request parameters" });
    }

    const result = await updateManagePost(
      request,
      sourceTypeResult.data as PostSourceType,
      postingId,
      postingActionResult.data,
    );
    return respond({ success: true, data: result });
  }

  // handle applicant decline action
  const declineAction = formData.get("decline");
  if (declineAction) {
    const applicationId = String(formData.get("applicationId") ?? "").trim();

    const params: DeclineApplicantParams = {
      declineAll: formData.get("declineAll") === "true",
      blockFutureApply: formData.get("blockFutureApply") === "true",
    };

    if (!applicationId) {
      return respond(
        { ok: false, message: "Application ID is required." },
        { status: 400 },
      );
    }

    if (!postingId) {
      return respond(
        { ok: false, message: "Posting ID is required." },
        { status: 400 },
      );
    }

    const sourceTypeResult = PostingSourceSchema.safeParse(sourceType);
    if (!sourceTypeResult.success) {
      return respond(
        { ok: false, message: "Invalid source type." },
        { status: 400 },
      );
    }

    try {
      const res = await declineApplicantStatus(
        request,
        sourceTypeResult.data as PostSourceType,
        postingId,
        applicationId,
        params,
      );

      if (res?.data) {
        return respond({ ok: true, success: true });
      }

      return respond({ ok: false, success: false }, { status: 400 });
    } catch (error: any) {
      if (error?.status === 409) {
        return respond(
          { ok: false, success: false, error: error?.details?.error },
          { status: 409 },
        );
      }
      return respond(
        { ok: false, success: false, error: "An unexpected error occurred." },
        { status: 500 },
      );
    }
  }

  // Handle applicant status actions
  const applicationId = String(formData.get("applicationId") ?? "").trim();
  const applicationIds = formData
    .getAll("applicationIds")
    .map((id) => String(id).trim())
    .filter(Boolean);
  const statusAction = String(formData.get("statusAction") ?? "").trim();
  const targetApplicationIds = applicationIds.length
    ? applicationIds
    : applicationId
      ? [applicationId]
      : [];

  if (!targetApplicationIds.length || !statusAction) {
    return respond({ success: false, error: "Missing required fields" });
  }

  const sourceTypeResult = PostingSourceSchema.safeParse(sourceType);
  const statusActionResult =
    ApplicantStatusActionSchema.safeParse(statusAction);
  if (!sourceTypeResult.success || !statusActionResult.success || !postingId) {
    return respond({ success: false, error: "Invalid request parameters" });
  }

  try {
    const result = await Promise.all(
      targetApplicationIds.map((targetApplicationId) =>
        updateApplicantStatus(
          request,
          sourceTypeResult.data as PostSourceType,
          postingId,
          targetApplicationId,
          statusActionResult.data as ApplicantStatusAction,
        ),
      ),
    );
    return respond({
      success: true,
      data: applicationIds.length ? result : result[0],
    });
  } catch (error: any) {
    if (error?.status === 409) {
      return respond({ success: false, error: error?.details?.error });
    }
    throw error;
  }
}
