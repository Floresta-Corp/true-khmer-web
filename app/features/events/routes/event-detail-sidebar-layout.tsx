import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useOutletContext } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { getPlumpiEventOrganizer } from "~/api/events/events.server";
import { EventDetailOverview } from "~/features/events/components/event-detail-overview";
import { EventOrganizerCard } from "~/features/events/components/event-organizer-card";
import type { EventDetailOutletContext } from "~/features/events/types/events";
import { readOptional } from "~/lib/server/api-client.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const result = await readOptional("event organizer", () =>
    getPlumpiEventOrganizer(request, params.slug ?? ""),
  );
  return { organizer: result?.data.organizer ?? null };
}

export default function EventDetailSidebarLayout() {
  const prefersReducedMotion = useReducedMotion();
  const context = useOutletContext<EventDetailOutletContext>();
  const { organizer } = useLoaderData<typeof loader>();

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">
        <Outlet context={context} />
      </div>

      <motion.aside
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          delay: prefersReducedMotion ? 0 : 0.18,
          ease: "easeOut",
        }}
        className="flex flex-col gap-6"
      >
        <EventDetailOverview event={context.event} />
        {organizer && <EventOrganizerCard organizer={organizer} />}
      </motion.aside>
    </div>
  );
}
