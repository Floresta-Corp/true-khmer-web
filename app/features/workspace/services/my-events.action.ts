import type { Route } from "project-types/workspace/route/+types/my-events";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";
import {
  PLUMPI_HANDOFF_RESPONSE_INIT,
  plumpiHandoffErrorMessage,
  plumpiHandoffParamsSchema,
  resolvePlumpiHandoffUrl,
} from "~/features/workspace/services/plumpi-handoff.server";
import type { MyEventsActionData } from "~/features/workspace/types/my-events";

/**
 * Opening an event card hands the organizer over to the Plumpi console, the
 * same way the "Continue in Plumpi" button does after a draft is created.
 */
export async function myEventsAction({ request }: Route.ActionArgs) {
  const auth = await requireUser(request);
  const formData = await request.formData();
  const cookies = auth.setCookie ? [auth.setCookie] : [];

  const params = plumpiHandoffParamsSchema.safeParse({
    intent: formData.get("intent"),
    eventId: formData.get("eventId"),
    organizationId: formData.get("organizationId"),
  });

  if (!params.success) {
    return withAuthData(
      { setCookie: cookies },
      {
        ok: false,
        error: "This event cannot be opened in Plumpi.",
      } satisfies MyEventsActionData,
      PLUMPI_HANDOFF_RESPONSE_INIT,
    );
  }

  try {
    const redirectTo = await resolvePlumpiHandoffUrl(
      requestWithSetCookie(request, auth.setCookie),
      params.data,
      cookies,
    );

    return withAuthData(
      { setCookie: cookies },
      { ok: true, redirectTo } satisfies MyEventsActionData,
      PLUMPI_HANDOFF_RESPONSE_INIT,
    );
  } catch (error) {
    console.error("My events handoff failed:", error);

    return withAuthData(
      { setCookie: cookies },
      {
        ok: false,
        error: plumpiHandoffErrorMessage(error),
      } satisfies MyEventsActionData,
      PLUMPI_HANDOFF_RESPONSE_INIT,
    );
  }
}
