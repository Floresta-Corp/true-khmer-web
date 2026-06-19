import {
  patchContentModerator,
  type DetailReportStatus,
} from "~/lib/server/auth/admin/content-moderator/content-moderator.server";
import { getAdminAccessToken } from "~/lib/server/session.server";
import { withAuthJson } from "~/lib/server/auth-response.server";

export async function contentModerationAction({
  request,
}: {
  request: Request;
}) {
  const formData = await request.formData();

  const reportUuid = formData.get("reportUuid") as string;
  const status = formData.get("status") as DetailReportStatus;

  const { accessToken, setCookie } = await getAdminAccessToken(request);

  if (!reportUuid || !status || !accessToken) {
    return withAuthJson({ setCookie }, { error: "Missing required fields" }, {
      status: 400,
    });
  }

  try {
    const response = await patchContentModerator(
      reportUuid,
      request,
      accessToken,
      status,
    );

    if (response.ok) {
      return withAuthJson({ setCookie }, { success: true, report: response.report });
    }

    return withAuthJson({ setCookie }, { error: "Failed to update report status" }, {
      status: 500,
    });
  } catch {
    return withAuthJson({ setCookie }, { error: "Server connection failed" }, {
      status: 500,
    });
  }
}
