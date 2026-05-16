import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplicantRange,
  ManagePostDetailResponse,
  PostSourceType,
} from "../types/detail-post-type";

export interface ManagePostDetailParams {
  search?: string;
  range?: ApplicantRange;
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
  if (params.range) queryParams.set("range", params.range);
  if (params.page !== undefined)
    queryParams.set("page", params.page.toString());
  if (params.limit !== undefined)
    queryParams.set("limit", params.limit.toString());

  const result = await apiRequestWithSession<ManagePostDetailResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}`,
    {
      method: "GET",
    },
  );

  return result;
}
