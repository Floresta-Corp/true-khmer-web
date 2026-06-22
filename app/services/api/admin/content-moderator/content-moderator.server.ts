import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type {
  ListContentModeratorReportsResponse,
  UpdateContentModeratorReportReviewResponse,
} from "~/types/api-client";

export enum ReportStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export enum DetailReportStatus {
  SAFE = "SAFE",
  HIDE = "HIDE",
}

export interface ContentModeratorParams {
  cursor?: string;
  limit?: string;
  status?: ReportStatus | (string & {});
  typeId?: string;
}

export async function getContentModerator(
  request: Request,
  accessToken: string,
  params: ContentModeratorParams,
) {
  const queryParams = new URLSearchParams();
  if (params.cursor) queryParams.set("cursor", params.cursor);
  if (params.typeId) queryParams.set("typeId", params.typeId);
  if (params.limit !== undefined)
    queryParams.set("limit", params.limit.toString());
  if (params.status) queryParams.set("status", params.status);
  const qs = queryParams.toString();
  const result =
    await apiRequestWithAccessToken<ListContentModeratorReportsResponse>(
      request,
      accessToken,
      `/admin/content-moderator${qs ? `?${qs}` : ""}`,
      { method: "GET" },
    );

  return { data: result };
}

export async function patchContentModerator(
  reportUuid: string,
  request: Request,
  accessToken: string,
  status: DetailReportStatus,
) {
  const result =
    await apiRequestWithAccessToken<UpdateContentModeratorReportReviewResponse>(
      request,
      accessToken,
      `/admin/content-moderator`,
      {
        method: "POST",

        body: { reportUuid, status },
      },
    );

  return result;
}
