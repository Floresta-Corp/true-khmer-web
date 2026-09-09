import { z } from "zod";
import type { Route } from "project-types/events/routes/+types/events.$slug";
import {
  buildPlumpiHandoffUrl,
  createPlumpiHandoff,
} from "~/api/events/events.server";
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

const responseInit = {
  headers: { "Cache-Control": "private, no-store" },
} satisfies ResponseInit;

/** Mints a one-time Plumpi session and sends it to the selected ticket tier. */
export async function eventTicketHandoffAction({
  params,
  request,
}: Route.ActionArgs) {
  const auth = await requireUser(request);
  const authenticatedRequest = requestWithSetCookie(request, auth.setCookie);
  const parsed = TicketHandoffSchema.safeParse(
    Object.fromEntries(await request.formData()),
  );

  if (!parsed.success) {
    return withAuthData(
      auth,
      { ok: false, error: "This ticket could not be opened in Plumpi." },
      responseInit,
    );
  }

  try {
    const handoff = await createPlumpiHandoff(authenticatedRequest);
    const setCookie = [auth.setCookie, handoff.setCookie].filter(
      (cookie): cookie is string => Boolean(cookie),
    );

    if (Date.now() >= new Date(handoff.data.expiresAt).getTime()) {
      throw new Error("The Plumpi handoff token expired before redirect.");
    }

    const nextPath = `/events/${encodeURIComponent(params.slug)}/order?ticketTierId=${encodeURIComponent(parsed.data.ticketTierId)}`;
    const redirectTo = buildPlumpiHandoffUrl(nextPath, handoff.data.token);

    return withAuthData(
      { setCookie },
      { ok: true, redirectTo } satisfies EventTicketHandoffActionData,
      responseInit,
    );
  } catch (error) {
    console.error("Ticket checkout handoff failed:", error);
    return withAuthData(
      auth,
      {
        ok: false,
        error: "Plumpi could not be opened right now. Please try again.",
      } satisfies EventTicketHandoffActionData,
      responseInit,
    );
  }
}
