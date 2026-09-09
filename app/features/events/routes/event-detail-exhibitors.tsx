import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import {
  getPlumpiEventExhibitorCategories,
  getPlumpiEventExhibitors,
  getPlumpiEventFloorPlanPhotos,
} from "~/api/events/events.server";
import { EventExhibitors } from "~/features/events/components/event-exhibitors";
import { readOptional } from "~/lib/server/api-client.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const slug = params.slug ?? "";
  const [exhibitorsResult, categoriesResult, floorPlanResult] =
    await Promise.all([
      readOptional("event exhibitors", () =>
        getPlumpiEventExhibitors(request, slug),
      ),
      readOptional("event exhibitor categories", () =>
        getPlumpiEventExhibitorCategories(request, slug),
      ),
      readOptional("event floor plan", () =>
        getPlumpiEventFloorPlanPhotos(request, slug),
      ),
    ]);

  return {
    exhibitors: exhibitorsResult?.data.exhibitors ?? [],
    exhibitorCategories: categoriesResult?.data.categories ?? [],
    floorPlanPhotos: floorPlanResult?.data.photos ?? [],
  };
}

export default function EventDetailExhibitorsRoute() {
  const { exhibitors, exhibitorCategories, floorPlanPhotos } =
    useLoaderData<typeof loader>();

  return (
    <EventExhibitors
      exhibitors={exhibitors}
      categories={exhibitorCategories}
      floorPlanPhotos={floorPlanPhotos}
    />
  );
}
