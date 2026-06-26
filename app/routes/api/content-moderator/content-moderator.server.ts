import { apiRequestWithAccessToken } from "~/lib/server/api-client.server";
import type {
  ContentModeratorReport,
  ListContentModeratorReportsResponse,
  UpdateContentModeratorReportReviewRequest,
  UpdateContentModeratorReportReviewResponse,
} from "~/types/api-client";

export type ReportStatus = ContentModeratorReport["status"];
export type DetailReportStatus = UpdateContentModeratorReportReviewRequest["status"];

export const REPORT_STATUSES = ["OPEN", "CLOSED"] as const satisfies readonly ReportStatus[];
export const DETAIL_REPORT_STATUSES = ["SAFE", "HIDE"] as const satisfies readonly DetailReportStatus[];

export interface ContentModeratorParams {
  cursor?: string;
  limit?: string;
  status?: ReportStatus;
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
  if (params.limit !== undefined) queryParams.set("limit", params.limit.toString());
  if (params.status) queryParams.set("status", params.status);
  const qs = queryParams.toString();

  const result = await apiRequestWithAccessToken<ListContentModeratorReportsResponse>(
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
  return apiRequestWithAccessToken<UpdateContentModeratorReportReviewResponse>(
    request,
    accessToken,
    `/admin/content-moderator`,
    { method: "POST", body: { reportUuid, status } },
  );
}
