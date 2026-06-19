import type { Route } from "project-types/admin/contentmoderator/routes/+types/content-moderator";
import { redirect } from "react-router";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  getContentModerator,
  ReportStatus,
} from "~/lib/server/auth/admin/content-moderator/content-moderator.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import type {
  ContentModeratorReport,
  CursorPagination,
} from "~/types/api-client";

type ContentModeratorData = {
  content: ContentModeratorReport[];
  types: Array<{ id: string; name: string }>;
  pagination: CursorPagination | null;
  userId: string | null;
};

export async function contentModeratorLoader({ request }: Route.LoaderArgs) {
  const auth = await requireSuperAdmin(request);
  const { accessToken } = await getAdminAccessToken(request);
  if (!accessToken) {
    throw redirect("/tk-admin/login");
  }
  const userId = auth.admin.id;

  if (!userId) {
    return withAuthData(auth, {
      content: [],
      types: [],
      pagination: null,
      userId: null,
    } satisfies ContentModeratorData);
  }

  const url = new URL(request.url);
  const cursor = url.searchParams.get("cursor") ?? undefined;
  const typeId = url.searchParams.get("typeId") ?? undefined;
  const rawStatus = url.searchParams.get("status") ?? undefined;
  const rawStatusUpper = rawStatus?.toUpperCase();
  const status: ReportStatus | undefined =
    rawStatusUpper &&
    Object.values(ReportStatus).includes(rawStatusUpper as ReportStatus)
      ? (rawStatusUpper as ReportStatus)
      : undefined;

  const [result, allTypesResult] = await Promise.all([
    getContentModerator(request, accessToken, {
      cursor,
      status,
      typeId,
    }),
    getContentModerator(request, accessToken, {}),
  ]);

  const typesMap = new Map<string, string>();
  for (const report of allTypesResult.data.reports ?? []) {
    if (report.type?.id && report.type?.name) {
      typesMap.set(report.type.id, report.type.name);
    }
  }

  return withAuthData(auth, {
    content: result.data.reports ?? [],
    types: Array.from(typesMap.entries()).map(([id, name]) => ({
      id,
      name,
    })),
    pagination: result.data.pagination ?? null,
    userId,
  } satisfies ContentModeratorData);
}
