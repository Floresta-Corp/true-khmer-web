import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import { getPlumpiEventSessions } from "~/api/events/events.server";
import { EventProgram } from "~/features/events/components/event-program";
import type { EventDetailOutletContext } from "~/features/events/types/events";
import { readOptional } from "~/lib/server/api-client.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const result = await readOptional("event sessions", () =>
    getPlumpiEventSessions(request, params.slug ?? ""),
  );
  return { sessions: result?.data.sessions ?? [] };
}

export default function EventDetailProgramsRoute() {
  const { event } = useOutletContext<EventDetailOutletContext>();
  const { sessions } = useLoaderData<typeof loader>();
  return <EventProgram event={event} sessions={sessions} />;
}
