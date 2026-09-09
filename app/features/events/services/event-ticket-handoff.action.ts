import { z } from "zod";
import type { Route } from "project-types/events/routes/+types/events.$slug";
import { plumpiTicketOrderPath } from "~/features/events/lib/plumpi-links";
import {
  PLUMPI_HANDOFF_RESPONSE_INIT,
  plumpiHandoffErrorMessage,
  resolvePlumpiHandoffUrl,
} from "~/lib/plumpi/handoff.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  requestWithSetCookie,
  requireUser,
} from "~/lib/server/route-guards.server";

const TicketHandoffSchema = z.object({
  intent: z.literal("select-ticket"),
  ticketTierId: z.string().trim().min(1),
});

export type EventTicketHandoffActionData =
  | { ok: true; redirectTo: string }
  | { ok: false; error: string };

/** Mints a one-time Plumpi session and sends it to the selected ticket tier. */
export async function eventTicketHandoffAction({
  params,
  request,
}: Route.ActionArgs) {
  const auth = await requireUser(request);
  const cookies = auth.setCookie ? [auth.setCookie] : [];
  const parsed = TicketHandoffSchema.safeParse(
    Object.fromEntries(await request.formData()),
  );

  if (!parsed.success) {
    return withAuthData(
      { setCookie: cookies },
      {
        ok: false,
        error: "This ticket could not be opened in Plumpi.",
      } satisfies EventTicketHandoffActionData,
      PLUMPI_HANDOFF_RESPONSE_INIT,
    );
  }

  try {
    const redirectTo = await resolvePlumpiHandoffUrl(
      requestWithSetCookie(request, auth.setCookie),
      plumpiTicketOrderPath(params.slug, parsed.data.ticketTierId),
      cookies,
    );

    return withAuthData(
      { setCookie: cookies },
      { ok: true, redirectTo } satisfies EventTicketHandoffActionData,
      PLUMPI_HANDOFF_RESPONSE_INIT,
    );
  } catch (error) {
    console.error("Ticket checkout handoff failed:", error);

    return withAuthData(
      { setCookie: cookies },
      {
        ok: false,
        error: plumpiHandoffErrorMessage(error),
      } satisfies EventTicketHandoffActionData,
      PLUMPI_HANDOFF_RESPONSE_INIT,
    );
  }
}
