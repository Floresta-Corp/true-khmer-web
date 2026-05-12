import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type { GetMyApplicationResponse } from "../types";

export interface MyApplicationQueryParams {
  tab?: string;
  status?: string;
}

export async function getMyApplicationResponse(
  request: Request,
  queryParams: MyApplicationQueryParams,
) {
  const searchParams = new URLSearchParams();
  if (queryParams.tab) {
    searchParams.set("type", queryParams.tab);
  }
  if (queryParams.status) {
    searchParams.set("status", queryParams.status);
  }
  const url = `/my-application?${searchParams.toString()}`;

  const result = await apiRequestWithSession<GetMyApplicationResponse>(
    request,
    url,
    {
      method: "GET",
    },
  );
  return result;
}
