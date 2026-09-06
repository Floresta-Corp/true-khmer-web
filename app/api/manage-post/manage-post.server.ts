import { GetLaunchpadDetail } from "~/api/launchpad/launchpad.server";
import { getOpportunityById } from "~/api/volunteer/volunteer.opportunities.server";
import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplicantFilter,
  ApplicantStatusAction,
  DeclineApplicantParams,
  DetailCandidateResponse,
  ManagePostDetailResponse,
  ManagePostResponse,
  PostingFilter,
  PostingType,
  PostSourceType,
  PrivateNoteInput,
  UpdateManagePostResponse,
} from "~/features/workspace/manage-post/types";

export interface ManagePostParams {
  search?: string;
  filter?: PostingFilter;
  type?: PostingType;
  page?: number;
  limit?: number;
}

export async function myManagePost(request: Request, params: ManagePostParams) {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.type) queryParams.set("type", params.type);
  if (params.filter) queryParams.set("filter", params.filter);
  if (params.page !== undefined)
    queryParams.set("page", params.page.toString());
  if (params.limit !== undefined)
    queryParams.set("limit", params.limit.toString());

  return apiRequestWithSession<ManagePostResponse>(
    request,
    `/workspace/manage-posting?${queryParams.toString()}`,
    { method: "GET" },
  );
}

export async function updateManagePost(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  postingAction: UpdateManagePostResponse,
) {
  return apiRequestWithSession<ManagePostResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/action/${postingAction}`,
    { method: "POST" },
  );
}

export async function updateManagePostExtendDate(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  deadline: string,
) {
  return apiRequestWithSession<ManagePostResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/extend-application-deadline`,
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
  sourceType: PostSourceType,
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
    `/workspace/manage-posting/${sourceType}/${postingId}?${queryParams.toString()}`,
    { method: "GET" },
  );
}

export async function getApplicantDetail(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  applicationId: string,
) {
  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/${applicationId}`,
    { method: "GET" },
  );
}

export async function updateApplicantStatus(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  applicationId: string,
  statusAction: ApplicantStatusAction,
) {
  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/${applicationId}/change-status/${statusAction}`,
    { method: "POST" },
  );
}

export async function declineApplicantStatus(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  applicationId: string,
  params: DeclineApplicantParams,
) {
  const queryParams = new URLSearchParams();
  if (params.declineAll) queryParams.set("declineAll", "true");
  if (params.blockFutureApply) queryParams.set("blockFutureApply", "true");

  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/${applicationId}/decline?${queryParams.toString()}`,
    { method: "POST" },
  );
}

export async function getCandidateNote(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  candidateId: string,
) {
  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/${candidateId}`,
    { method: "GET" },
  );
}

export async function updateApplicantNote(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  candidateId: string,
  body: PrivateNoteInput,
) {
  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/${candidateId}/note`,
    { method: "POST", body },
  );
}

export type PostingSuspension = {
  suspendedAt: string | null;
  suspensionReason: string | null;
};

export async function getPostingSuspension(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
): Promise<PostingSuspension | null> {
  try {
    if (sourceType === "projects") {
      const launchpad = await GetLaunchpadDetail(postingId, request);
      if (!launchpad) return null;

      return {
        suspendedAt: launchpad.suspendedAt ?? null,
        suspensionReason: launchpad.suspensionReason ?? null,
      };
    }

    const result = await getOpportunityById(request, postingId);
    const opportunity = result?.data?.opportunity;
    if (!opportunity) return null;

    return {
      suspendedAt: opportunity.suspendedAt ?? null,
      suspensionReason: opportunity.suspensionReason ?? null,
    };
  } catch {
    return null;
  }
}
