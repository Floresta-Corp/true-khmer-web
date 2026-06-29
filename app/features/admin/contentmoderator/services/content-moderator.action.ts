import type { Route } from "project-types/admin/contentmoderator/route/+types/content-moderator";
import {
  patchContentModerator,
  DETAIL_REPORT_STATUSES,
} from "~/api/admin/content-moderator/content-moderator.server";
import type { DetailReportStatus } from "~/api/admin/content-moderator/content-moderator.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import { requireSuperAdmin } from "~/lib/server/route-guards.server";

const VALID_STATUSES = new Set<string>(DETAIL_REPORT_STATUSES);

export async function contentModerationAction({ request }: Route.ActionArgs) {
  await requireSuperAdmin(request);
  const formData = await request.formData();

  const reportUuid = formData.get("reportUuid");
  const status = formData.get("status");

  const { accessToken, setCookie } = await getAdminAccessToken(request);

  if (
    !reportUuid ||
    typeof reportUuid !== "string" ||
    reportUuid.trim() === "" ||
    !status ||
    !VALID_STATUSES.has(String(status)) ||
    !accessToken
  ) {
    return withAuthJson(
      { setCookie },
      { error: "Missing or invalid required fields" },
      { status: 400 },
    );
  }

  try {
    const response = await patchContentModerator(
      reportUuid,
      request,
      accessToken,
      status as DetailReportStatus,
    );

    if (response.ok && response.report) {
      return withAuthJson({ setCookie }, { success: true, report: response.report });
    }

    return withAuthJson(
      { setCookie },
      { error: "Failed to update report status" },
      { status: 500 },
    );
  } catch {
    return withAuthJson(
      { setCookie },
      { error: "Server connection failed" },
      { status: 500 },
    );
  }
}
