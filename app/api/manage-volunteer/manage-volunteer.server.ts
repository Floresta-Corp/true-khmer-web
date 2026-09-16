import * as z from "zod";
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
  PrivateNoteInput,
  UpdateManagePostResponse,
} from "~/features/workspace/manage-volunteer/types";

export const UuidSchema = z.uuid();

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
    `/workspace/manage-posting/volunteer?${queryParams.toString()}`,
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
    `/workspace/manage-posting/volunteer/${postingId}/action/${postingAction}`,
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
    `/workspace/manage-posting/volunteer/${postingId}/extend-application-deadline`,
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
    `/workspace/manage-posting/volunteer/${postingId}?${queryParams.toString()}`,
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
    `/workspace/manage-posting/volunteer/${postingId}/${applicationId}/change-status/${statusAction}`,
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
    `/workspace/manage-posting/volunteer/${postingId}/${applicationId}/decline?${queryParams.toString()}`,
    { method: "POST" },
  );
}

export async function getCandidateNote(
  request: Request,
  postingId: string,
  candidateId: string,
) {
  if (!UuidSchema.safeParse(postingId).success) return null;
  if (!UuidSchema.safeParse(candidateId).success) return null;

  return apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/volunteer/${postingId}/${candidateId}`,
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
    `/workspace/manage-posting/volunteer/${postingId}/${candidateId}/note`,
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
  try {
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
