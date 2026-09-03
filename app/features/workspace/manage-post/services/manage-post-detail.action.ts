import type { Route } from "project-types/workspace/manage-post/route/+types/manage-post.$sourceType.$id";
import z from "zod";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { transformActionResponse } from "~/lib/server/action-response.server";
import {
  declineApplicantStatus,
  updateApplicantNote,
  updateApplicantStatus,
  updateManagePost,
  updateManagePostExtendDate,
} from "~/api/manage-post/manage-post.server";
import {
  ApplicantStatusActionSchema,
  PostingSourceSchema,
  UpdateManagePostSchema,
  type ApplicantStatusAction,
  type DeclineApplicantParams,
  type PostSourceType,
  type PrivateNoteInput,
} from "~/features/workspace/manage-post/types";

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

  const DeadlineDatetimeSchema = z.string().datetime({ offset: true });

  const allowedActionTypes = new Set([
    "postingAction",
    "note",
    "change-status",
    "decline",
    "extend-application-deadline",
  ]);

  if (actionType && !allowedActionTypes.has(actionType)) {
    return respond({ ok: false, message: "Unsupported action." });
  }

  const postingAction = formData.get("postingAction");

  if (actionType === "extend-application-deadline") {
    const deadline = String(formData.get("deadline") ?? "").trim();
    const sourceTypeResult = PostingSourceSchema.safeParse(sourceType);

    if (!sourceTypeResult.success || !postingId) {
      return respond(
        { success: false, ok: false, error: "Invalid request parameters." },
        { status: 400 },
      );
    }

    const deadlineResult = DeadlineDatetimeSchema.safeParse(deadline);
    if (!deadlineResult.success) {
      return respond(
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
      return respond({ success: true, ok: true, data: result });
    } catch (error: any) {
      const transformedError = transformActionResponse(error);
      return respond(
        {
          success: false,
          ok: false,
          error: transformedError.error ?? "Unable to extend deadline.",
        },
        { status: error?.status ?? 500 },
      );
    }
  }

  if (actionType === "note") {
    const candidateId = String(formData.get("candidateId") ?? "").trim();
    const noteSourceType = String(formData.get("sourceType") ?? "").trim();
    const notePostingId = String(formData.get("postingId") ?? "").trim();
    const note = String(formData.get("note") ?? "").trim();

    if (!candidateId) {
      return respond(
        { ok: false, message: "Candidate ID is required." },
        { status: 400 },
      );
    }

    if (!notePostingId) {
      return respond(
        { ok: false, message: "Posting ID is required." },
        { status: 400 },
      );
    }

    const body: PrivateNoteInput = { note };

    try {
      const res = await updateApplicantNote(
        request,
        noteSourceType as PostSourceType,
        notePostingId,
        candidateId,
        body,
      );

      if (res && res.data?.applicant?.privateNote) {
        return respond({ success: true, ok: true });
      }

      return respond({ success: false, ok: false }, { status: 400 });
    } catch (error: any) {
      const transformedError = transformActionResponse(error);
      return respond(
        {
          success: false,
          ok: false,
          error: transformedError.error ?? "An unexpected error occurred.",
        },
        { status: error?.status ?? 500 },
      );
    }
  }

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

    try {
      const result = await updateManagePost(
        request,
        sourceTypeResult.data as PostSourceType,
        postingId,
        postingActionResult.data,
      );
      return respond({ success: true, ok: true, data: result });
    } catch (error: any) {
      return respond(transformActionResponse(error), {
        status: error?.status ?? 500,
      });
    }
  }

  const declineAction = formData.get("decline");
  if (declineAction) {
    const applicationId = String(formData.get("applicationId") ?? "").trim();

    const declineParams: DeclineApplicantParams = {
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
        declineParams,
      );

      if (res?.data) {
        return respond({ ok: true, success: true });
      }

      return respond({ ok: false, success: false }, { status: 400 });
    } catch (error: any) {
      const transformedError = transformActionResponse(error);
      return respond(
        {
          ok: false,
          success: false,
          error: transformedError.error ?? "An unexpected error occurred.",
        },
        { status: error?.status ?? 500 },
      );
    }
  }

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
    const transformedError = transformActionResponse(error);
    return respond(
      {
        ok: false,
        success: false,
        error: transformedError.error ?? "An unexpected error occurred.",
      },
      { status: error?.status ?? 500 },
    );
  }
}
