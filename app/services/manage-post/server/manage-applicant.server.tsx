import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplicantStatusAction,
  DetailCandidateResponse,
  PostSourceType,
  PrivateNoteInput,
} from "../types";

export async function getApplicantDetail(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  applicationId: string,
) {
  const result = await apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/${applicationId}`,
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

export async function getCandidateNote(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  candidateId: string,
) {
  const result = await apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/${candidateId}`,
    {
      method: "GET",
    },
  );
  return result;
}

export async function updateApplicantNote(
  request: Request,
  sourceType: PostSourceType,
  postingId: string,
  candidateId: string,
  body: PrivateNoteInput,
) {
  const result = await apiRequestWithSession<DetailCandidateResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}/${candidateId}/note`,
    {
      method: "POST",
      body,
    },
  );
  return result;
}
