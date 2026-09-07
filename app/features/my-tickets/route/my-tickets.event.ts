import type { LoaderFunctionArgs } from "react-router";
import { getEventTickets } from "~/api/my-tickets/my-tickets.server";
import { requireUser } from "~/lib/server/route-guards.server";
import { withAuthJson } from "~/lib/server/auth-response.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
export async function loader({ request, params }: LoaderFunctionArgs) {
  const auth = await requireUser(request);
  try {
    const result = await getEventTickets(request, params.eventId!);
    return withAuthJson(
      { setCookie: result.setCookie ?? auth.setCookie },
      result.data,
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    if (error instanceof Response) throw error;
    return withAuthJson(
      auth,
      { error: "Unable to load your tickets. Please try again." },
      { status: error instanceof ProtectedApiError ? error.status : 502 },
    );
  }
}
