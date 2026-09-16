import { GetLaunchpadDetail } from "~/api/launchpad/launchpad.server";
import {
  apiRequestWithSession,
  ProtectedApiError,
} from "~/lib/server/api-client.server";
import type {
  ApplicantFilter,
  ApplicantStatusAction,
  DeclineApplicantParams,
  DetailCandidateResponse,
  ManagePostDetailResponse,
  ManagePostResponse,
  PostingFilter,
  PrivateNoteInput,
  UpdateManagePostResponse,
} from "~/features/workspace/manage-launchpad/types";

export interface ManagePostParams {
  search?: string;
  filter?: PostingFilter;
  page?: number;
  limit?: number;
}

export async function myManagePost(request: Request, params: ManagePostParams) {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.filter) queryParams.set("filter", params.filter);
  if (params.page !== undefined)
    queryParams.set("page", params.page.toString());
  if (params.limit !== undefined)
    queryParams.set("limit", params.limit.toString());

  return apiRequestWithSession<ManagePostResponse>(
    request,
    `/workspace/manage-posting/launchpad?${queryParams.toString()}`,
    { method: "GET" },
  );
}

export async function updateManagePost(
  request: Request,
  postingId: string,
  postingAction: UpdateManagePostResponse,
) {
  return apiRequestWithSession<ManagePostResponse>(
    request,
    `/workspace/manage-posting/projects/${postingId}/action/${postingAction}`,
    { method: "POST" },
  );
}

export async function updateManagePostExtendDate(
  request: Request,
  postingId: string,
  deadline: string,
) {
  return apiRequestWithSession<ManagePostResponse>(
    request,
    `/workspace/manage-posting/projects/${postingId}/extend-application-deadline`,
    { method: "POST", body: { deadline } },
  );
}

export interface ManagePostDetailParams {
  search?: string;
  filter?: ApplicantFilter;
  page?: number;
  limit?: number;
}

export async function getManagePostDetail(
  request: Request,
  params: ManagePostDetailParams,
  postingId: string,
) {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.filter) queryParams.set("filter", params.filter);
  if (params.page !== undefined)
    queryParams.set("page", params.page.toString());
  if (params.limit !== undefined)
    queryParams.set("limit", params.limit.toString());

  return apiRequestWithSession<ManagePostDetailResponse>(
    request,
    `/workspace/manage-posting/projects/${postingId}?${queryParams.toString()}`,
    { method: "GET" },
  );
}

export async function updateApplicantStatus(
  request: Request,
  postingId: string,
  applicationId: string,
  statusAction: ApplicantStatusAction,
) {
  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/projects/${postingId}/${applicationId}/change-status/${statusAction}`,
    { method: "POST" },
  );
}

export async function declineApplicantStatus(
  request: Request,
  postingId: string,
  applicationId: string,
  params: DeclineApplicantParams,
) {
  const queryParams = new URLSearchParams();
  if (params.declineAll) queryParams.set("declineAll", "true");
  if (params.blockFutureApply) queryParams.set("blockFutureApply", "true");

  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/projects/${postingId}/${applicationId}/decline?${queryParams.toString()}`,
    { method: "POST" },
  );
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function requireUuid(value: string, label: string) {
  if (!UUID_PATTERN.test(value)) {
    throw new ProtectedApiError(`Invalid ${label}.`, 400);
  }
  return value;
}

export async function getCandidateNote(
  request: Request,
  postingId: string,
  candidateId: string,
) {
  requireUuid(postingId, "postingId");
  requireUuid(candidateId, "candidateId");

  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/projects/${postingId}/${candidateId}`,
    { method: "GET" },
  );
}

export async function updateApplicantNote(
  request: Request,
  postingId: string,
  candidateId: string,
  body: PrivateNoteInput,
) {
  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/projects/${postingId}/${candidateId}/note`,
    { method: "POST", body },
  );
}

export type PostingSuspension = {
  suspendedAt: string | null;
  suspensionReason: string | null;
};

export async function getPostingSuspension(
  request: Request,
  postingId: string,
): Promise<PostingSuspension | null> {
  const launchpad = await GetLaunchpadDetail(postingId, request);
  if (!launchpad) return null;
  return {
    suspendedAt: launchpad.suspendedAt ?? null,
    suspensionReason: launchpad.suspensionReason ?? null,
  };
}
