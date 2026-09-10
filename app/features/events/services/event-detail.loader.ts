import type { Route } from "project-types/events/routes/+types/events.$slug";
import { redirect } from "react-router";
import { getPlumpiEventBySlug } from "~/api/events/events.server";
import { getSavedEventIds } from "~/api/saved-items/saved-items.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { ProtectedApiError } from "~/lib/server/api-client.server";
import { EventDetailSchema } from "~/features/events/types/events";

const NOT_FOUND = "We could not find that event. It may have been removed.";
const LOAD_ERROR = "Unable to load this event right now. Please try again.";

/**
 * One public event, addressed by slug.
 *
 * A missing event and a failing read are both rendered by the page rather than
 * thrown, so a bad link shows the events shell instead of the error boundary.
 */
export async function eventDetailLoader({ params, request }: Route.LoaderArgs) {
  try {
    const [result, savedEventIds] = await Promise.all([
      getPlumpiEventBySlug(request, params.slug),
      getSavedEventIds(request),
    ]);
    const parsed = EventDetailSchema.safeParse(result.data.event);

    if (!parsed.success) {
      console.error("Plumpi returned an unexpected event shape:", parsed.error);
      return withAuthData(
        { setCookie: result.setCookie },
        {
          event: null,
          isSaved: false,
          loadError: LOAD_ERROR,
        },
      );
    }

    const pathname = new URL(request.url).pathname.replace(/\/$/, "");
    const activeTab = pathname.endsWith("/details")
      ? "details"
      : pathname.endsWith("/programs")
        ? "programs"
        : pathname.endsWith("/exhibitors")
          ? "exhibitors"
          : "attend";

    if (
      (activeTab === "programs" && !parsed.data.features.programs) ||
      (activeTab === "exhibitors" && !parsed.data.features.exhibitors)
    ) {
      throw redirect(
        `/events/detail/${encodeURIComponent(params.slug)}/details`,
      );
    }

    return withAuthData(
      { setCookie: result.setCookie },
      {
        event: { ...parsed.data, tickets: [] },
        // Our saved list is the truth here, not Plumpi's own favourite flag.
        isSaved: savedEventIds.includes(parsed.data.id),
        loadError: null,
      },
    );
  } catch (error) {
    if (error instanceof Response) throw error;

    const isMissing =
      error instanceof ProtectedApiError && error.status === 404;
    if (!isMissing) {
      console.error("Could not load the Plumpi event detail:", error);
    }

    return withAuthData(
      {},
      {
        event: null,
        isSaved: false,
        loadError: isMissing ? NOT_FOUND : LOAD_ERROR,
      },
    );
  }
}
