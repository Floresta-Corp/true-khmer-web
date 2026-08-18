import { data } from "react-router";

import {
  suspendLaunchpad,
  unsuspendLaunchpad,
} from "~/api/admin/manage-launchpad/manage-launchpad.server";

const REASON_MAX_LENGTH = 500;

const INTENTS = ["suspendLaunchpad", "unsuspendLaunchpad"] as const;

export type LaunchpadSuspendIntent = (typeof INTENTS)[number];

export function isLaunchpadSuspendIntent(
  intent: string,
): intent is LaunchpadSuspendIntent {
  return (INTENTS as readonly string[]).includes(intent);
}

export async function handleLaunchpadSuspendIntent(
  request: Request,
  accessToken: string,
  formData: FormData,
  intent: LaunchpadSuspendIntent,
  cookieHeader: ResponseInit,
) {
  const launchpadId = String(formData.get("launchpadId") ?? "").trim();

  if (!launchpadId) {
    return data(
      { ok: false, message: "Project ID is required" },
      { status: 400 },
    );
  }

  const isSuspend = intent === "suspendLaunchpad";
  let reason = "";

  if (isSuspend) {
    reason = String(formData.get("reason") ?? "").trim();

    if (reason.length > REASON_MAX_LENGTH) {
      return data(
        {
          ok: false,
          message: `Reason must be ${REASON_MAX_LENGTH} characters or fewer.`,
        },
        { status: 400 },
      );
    }
  }

  const result = isSuspend
    ? await suspendLaunchpad(
        request,
        accessToken,
        launchpadId,
        reason ? { reason } : {},
      )
    : await unsuspendLaunchpad(request, accessToken, launchpadId);

  return data(
    {
      ok: true,
      intent,
      launchpadId,
      status: result.status,
      message: `Project ${isSuspend ? "suspended" : "restored"}.`,
    },
    cookieHeader,
  );
}
