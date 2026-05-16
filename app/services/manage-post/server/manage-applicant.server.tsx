import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplicantStatusAction,
  DetailCandidateResponse,
  PostSourceType,
} from "../types";

export async function getApplicantDetail(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  applicationId: string,
) {
  // const queryParams = new URLSearchParams();

  const result = await apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/v1/workspace/manage-posting/${sourceType}/${postingId}/${applicationId}`,
    {
      method: "GET",
    },
  );

  return result;
}

export async function updateApplicantStatus(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  applicationId: string,
  statusAction: ApplicantStatusAction,
) {
  const result = await apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/${applicationId}/change-status/${statusAction}`,
    {
      method: "POST",
    },
  );

  return result;
}
