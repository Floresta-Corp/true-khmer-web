import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData, useOutletContext } from "react-router";
import { getPlumpiEventPhotos } from "~/api/events/events.server";
import { EventDetailsPanel } from "~/features/events/components/event-details-panel";
import { EventTabTransition } from "~/features/events/components/event-tab-transition";
import type { EventDetailOutletContext } from "~/features/events/types/events";
import { readOptional } from "~/lib/server/api-client.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const result = await readOptional("event photos", () =>
    getPlumpiEventPhotos(request, params.slug ?? ""),
  );
  return { photos: result?.data.photos ?? [] };
}

export default function EventDetailDetailsRoute() {
  const { event } = useOutletContext<EventDetailOutletContext>();
  const { photos } = useLoaderData<typeof loader>();
  return (
    <EventTabTransition>
      <EventDetailsPanel event={event} photos={photos} />
    </EventTabTransition>
  );
}
