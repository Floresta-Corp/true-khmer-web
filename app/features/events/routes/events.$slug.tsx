import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useRouteLoaderData,
} from "react-router";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "~/lib/utils";
import { EventDetailCover } from "~/features/events/components/event-detail-cover";
import { EventDetailOverview } from "~/features/events/components/event-detail-overview";
import { eventDetailLoader } from "~/features/events/services/event-detail.loader";
import { eventTicketHandoffAction } from "~/features/events/services/event-ticket-handoff.action";
import type { EventDetail } from "~/features/events/types/events";

export const loader = eventDetailLoader;
export const action = eventTicketHandoffAction;

export function meta({ data }: { data?: { event: EventDetail | null } }) {
  const title = data?.event?.title;
  return [{ title: title ? `${title} | True Khmer` : "Event | True Khmer" }];
}

function BackToEvents() {
  return (
    <Link
      to="/events"
      className="mb-5 inline-flex items-center gap-1.5 text-base font-bold text-[#9A9AB0] transition-colors hover:text-[#1A1A2E]"
    >
      <ChevronLeft className="size-4.5" aria-hidden />
      Back to Explore
    </Link>
  );
}

export default function EventDetailPage() {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const appLayoutData = useRouteLoaderData("layout/app-layout") as
    | { user: unknown | null }
    | undefined;
  const { event, loadError } = useLoaderData<typeof loader>();
  const [isSaved, setIsSaved] = useState(() => event?.isFavorite ?? false);

  if (!event) {
    return (
      <div className="min-h-screen bg-white">
        <main className="site-container pt-8 pb-12 font-tk-edu sm:pt-12 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          >
            <BackToEvents />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.05,
            }}
            className="py-20 text-center text-[15px] text-[#9A9AB0]"
          >
            {loadError ?? "We could not find that event."}
          </motion.p>
        </main>
      </div>
    );
  }

  const basePath = `/events/detail/${encodeURIComponent(event.slug)}`;
  const tabs = [
    { key: "attend", label: "Get Tickets", to: basePath, end: true },
    { key: "details", label: "Details", to: `${basePath}/details` },
    ...(event.features.programs
      ? [{ key: "programs", label: "Programs", to: `${basePath}/programs` }]
      : []),
    ...(event.features.exhibitors
      ? [
          {
            key: "exhibitors",
            label: "Exhibitors",
            to: `${basePath}/exhibitors`,
          },
        ]
      : []),
  ];
  const usesWideContent =
    location.pathname.endsWith("/programs") ||
    location.pathname.endsWith("/exhibitors");

  return (
    <div className="min-h-screen bg-white">
      <main className="site-container pt-8 pb-12 font-tk-edu sm:pt-12 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        >
          <BackToEvents />
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 20,
            scale: prefersReducedMotion ? 1 : 0.99,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.35,
            delay: prefersReducedMotion ? 0 : 0.05,
            ease: "easeOut",
          }}
        >
          <EventDetailCover
            event={event}
            isSaved={isSaved}
            onToggleSave={() => setIsSaved((saved) => !saved)}
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : 0.1,
          }}
          className="mb-6 text-[30px] leading-[1.15] font-extrabold text-[#1A1A2E] sm:text-[40px]"
        >
          {event.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.3,
            delay: prefersReducedMotion ? 0 : 0.14,
          }}
          className="mb-8 flex gap-8 overflow-x-auto border-b border-[#E5E7EB]"
        >
          {tabs.map((tab) => (
            <NavLink
              key={tab.key}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                cn(
                  "border-b-2 px-1 py-2.5 text-[17px] font-bold whitespace-nowrap transition-colors",
                  isActive
                    ? "border-[#1C5DD4] text-[#1C5DD4]"
                    : "border-transparent text-[#9A9AB0] hover:text-[#1A1A2E]",
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </motion.div>

        <div
          className={cn(
            "grid items-start gap-8",
            !usesWideContent && "lg:grid-cols-[minmax(0,1fr)_360px]",
          )}
        >
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -8 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.25,
                  ease: "easeOut",
                }}
              >
                <Outlet
                  context={{
                    event,
                    isAuthenticated: Boolean(appLayoutData?.user),
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {!usesWideContent && (
            <motion.aside
              initial={{
                opacity: 0,
                x: prefersReducedMotion ? 0 : 14,
                y: prefersReducedMotion ? 0 : 12,
              }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.2,
              }}
              className="lg:sticky lg:top-24"
            >
              <EventDetailOverview event={event} />
            </motion.aside>
          )}
        </div>
      </main>
    </div>
  );
}
