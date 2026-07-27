import { redirect } from "react-router";
import type { Route } from "project-types/admin/contentmoderator/route/+types/content-moderator";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  getContentModerator,
  REPORT_STATUSES,
} from "~/api/admin/content-moderator/content-moderator.server";
import type { ReportStatus } from "~/api/admin/content-moderator/content-moderator.server";
import { requireAdmin } from "~/lib/server/route-guards.server";
import type { ContentModeratorData, ContentModeratorStats } from "../types";

const EMPTY_STATS: ContentModeratorStats = {
  openReports: 0,
  resolvedReports: 0,
  totalReports: 0,
  avgResolutionTime: null,
};

export async function contentModeratorLoader({ request }: Route.LoaderArgs) {
  const auth = await requireAdmin(request);
  const { accessToken } = auth;
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }
  const userId = auth.admin.id;

  if (!userId) {
    return withAuthData(auth, {
      content: [],
      types: [],
      pagination: null,
      stats: EMPTY_STATS,
      userId: null,
      highlightedReportId: null,
    } satisfies ContentModeratorData);
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const typeId = url.searchParams.get("typeId") ?? undefined;
  const rawStatus = url.searchParams.get("status")?.toUpperCase();
  const status = (REPORT_STATUSES as readonly string[]).includes(
    rawStatus ?? "",
  )
    ? (rawStatus as ReportStatus)
    : undefined;
  // A notification link (?contentId=<uuid>) targets the reported content. The
  // list endpoint can't be filtered by contentId, so we match the report on
  // the current page via its sourceLink (which embeds the content id) below.
  const contentId = url.searchParams.get("contentId") ?? undefined;

  const [result, allTypesResult] = await Promise.all([
    getContentModerator(request, accessToken, { cursor, status, typeId }),
    getContentModerator(request, accessToken, {}),
  ]);
  const stats: ContentModeratorStats =
    allTypesResult.data.summary ?? EMPTY_STATS;

  const typesMap = new Map<string, string>();
  for (const report of allTypesResult.data.reports ?? []) {
    if (report.type?.id && report.type?.name) {
      typesMap.set(report.type.id, report.type.name);
    }
  }

  let content = result.data.reports ?? [];
  // Match the report for the reported content by its sourceLink, which embeds
  // the content id. Only reports on the current page can be matched (the list
  // endpoint has no contentId filter).
  const targetReport = contentId
    ? content.find((r) => r.sourceLink?.includes(contentId))
    : undefined;

  if (targetReport) {
    content = [
      targetReport,
      ...content.filter((r) => r.id !== targetReport.id),
    ];
  }

  return withAuthData(auth, {
    content,
    types: Array.from(typesMap.entries()).map(([id, name]) => ({ id, name })),
    pagination: result.data.pagination ?? null,
    stats,
    userId,
    highlightedReportId: targetReport?.id ?? null,
  } satisfies ContentModeratorData);
}
