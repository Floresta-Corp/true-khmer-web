import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ManagePostResponse,
  ManagePostStatus,
  SourceType,
} from "../types";

export interface ManagePostParams {
  search?: string;
  status?: ManagePostStatus;
  source?: SourceType;
  page?: number;
  limit?: number;
}

export async function myManagePost(request: Request, params: ManagePostParams) {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set("search", params.search);
  if (params.source) queryParams.set("source", params.source);
  if (params.status) queryParams.set("status", params.status);
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
