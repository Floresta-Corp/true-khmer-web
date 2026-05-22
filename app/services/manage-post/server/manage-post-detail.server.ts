import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplicantFilter,
  ManagePostDetailResponse,
  PostSourceType,
} from "../types/detail-post-type";

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

  const result = await apiRequestWithSession<ManagePostDetailResponse>(
    request,
    `/workspace/manage-posting/${sourceType}/${postingId}?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );

  return result;
}
