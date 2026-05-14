import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type { ManagePostResponse, PostingFilter, PostingType } from "../types";

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

  const result = await apiRequestWithSession<ManagePostResponse>(
    request,
    `/workspace/manage-posting?${queryParams.toString()}`,
    {
      method: "GET",
    },
  );

  return result;
}
