import { apiRequestWithSession } from "~/lib/server/api-client.server";
import type {
  ApplicationArchiveAction,
  ApplicationStatusAction,
  GetMyApplicationResponse,
} from "../types";

export interface MyApplicationQueryParams {
  tab?: string;
  filter?: string;
}

export async function getMyApplicationResponse(
  request: Request,
  queryParams: MyApplicationQueryParams,
) {
  const searchParams = new URLSearchParams();
  if (queryParams.tab) {
    searchParams.set("type", queryParams.tab);
  }
  if (queryParams.filter) {
    searchParams.set("filter", queryParams.filter);
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

export async function getMyApplicationDetailResponse(
  request: Request,
  sourceType: string,
  applicationId: string,
) {
  const url = `/my-application/${encodeURIComponent(
    sourceType,
  )}/${encodeURIComponent(applicationId)}`;

  const result = await apiRequestWithSession(request, url, {
    method: "GET",
  });
  return result;
}

export async function postMyApplicationChangeStatus(
  request: Request,
  sourceType: string,
  applicationId: string,
  statusAction: ApplicationStatusAction,
) {
  const url = `/my-application/${encodeURIComponent(
    sourceType,
  )}/${encodeURIComponent(applicationId)}/change-status/${encodeURIComponent(
    statusAction,
  )}`;

  const result = await apiRequestWithSession(request, url, {
    method: "POST",
  });
  return result;
}

export async function postMyApplicationArchiveAction(
  request: Request,
  sourceType: string,
  applicationId: string,
  archiveAction: ApplicationArchiveAction,
) {
  const url = `/my-application/${encodeURIComponent(
    sourceType,
  )}/${encodeURIComponent(applicationId)}/archive/${encodeURIComponent(
    archiveAction,
  )}`;

  const result = await apiRequestWithSession(request, url, {
    method: "POST",
  });
  return result;
}
