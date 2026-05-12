import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type { GetMyApplicationResponse } from "../types";

export async function getMyApplicationResponse(
  request: Request,
  queryParams: Record<string, any>,
) {
  const searchParams = new URLSearchParams(queryParams);
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
