import { data } from "react-router";

import {
  suspendVolunteer,
  unsuspendVolunteer,
} from "~/api/admin/manage-volunteer/manage-volunteer.server";

const REASON_MAX_LENGTH = 500;

const INTENTS = ["suspendVolunteer", "unsuspendVolunteer"] as const;

export type VolunteerSuspendIntent = (typeof INTENTS)[number];

export function isVolunteerSuspendIntent(
  intent: string,
): intent is VolunteerSuspendIntent {
  return (INTENTS as readonly string[]).includes(intent);
}

export async function handleVolunteerSuspendIntent(
  request: Request,
  accessToken: string,
  formData: FormData,
  intent: VolunteerSuspendIntent,
  cookieHeader: ResponseInit,
) {
  const opportunityId = String(formData.get("opportunityId") ?? "").trim();

  if (!opportunityId) {
    return data(
      { ok: false, message: "Opportunity ID is required" },
      { status: 400 },
    );
  }

  const isSuspend = intent === "suspendVolunteer";
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
    ? await suspendVolunteer(
        request,
        accessToken,
        opportunityId,
        reason ? { reason } : {},
      )
    : await unsuspendVolunteer(request, accessToken, opportunityId);

  return data(
    {
      ok: true,
      intent,
      opportunityId,
      status: result.status,
      message: `Opportunity ${isSuspend ? "suspended" : "restored"}.`,
    },
    cookieHeader,
  );
}
