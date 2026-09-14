import {
  Link,
  NavLink,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigation,
  useRouteLoaderData,
} from "react-router";
import { ChevronLeft } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "~/lib/utils";
import { EventDetailCover } from "~/features/events/components/event-detail-cover";
import {
  EventDetailTabSkeleton,
  type EventDetailTab,
} from "~/features/events/components/event-detail-tab-skeleton";
import { eventDetailLoader } from "~/features/events/services/event-detail.loader";
import { eventTicketHandoffAction } from "~/features/events/services/event-ticket-handoff.action";
import type { EventDetail } from "~/features/events/types/events";
import type { ScrollGroupHandle } from "~/lib/scroll-restoration";
import type { Route } from "./+types/events.$slug";
import { metaOrigin, pageMeta } from "~/lib/seo";
import { breadcrumbJsonLd, eventJsonLd } from "~/lib/seo/structured-data";

export const loader = eventDetailLoader;
export const action = eventTicketHandoffAction;
export const handle: ScrollGroupHandle = { scrollGroup: true };

export function meta(args: Route.MetaArgs) {
  const event = args.data?.event;
  const origin = metaOrigin(args);

  if (!event) {
    return pageMeta(args, {
      title: "Event",
      description: "This event could not be found.",
      noindex: true,
    });
  }

  const path = `/events/detail/${event.slug}`;
  const location = event.isOnline ? "Online" : (event.venueName ?? "Cambodia");

  const price = event.entryMode === "TICKETED" ? undefined : 0;

  return pageMeta(args, {
    title: event.title,
    description:
      event.excerpt ||
      event.description ||
      `${event.title} — ${event.categoryLabel} in ${location}.`,
    type: "article",
    image: event.cover ?? event.photos[0] ?? null,

    canonicalPath: path,
    jsonLd: [
      eventJsonLd({
        origin,
        pathname: path,
        name: event.title,
        description: event.excerpt || event.description,
        image: event.cover ?? event.photos[0] ?? null,
        startAt: event.startAt,
        endAt: event.endAt,
        isOnline: event.isOnline,
        venueName: event.venueName,
        venueAddress: event.venueAddress,
        price,
      }),
      breadcrumbJsonLd(origin, [
        { name: "Home", path: "/" },
        { name: "Events", path: "/events" },
        { name: event.title, path },
      ]),
    ],
  });
}

const trimSlash = (pathname: string) => pathname.replace(/\/+$/, "");

function tabFromPath(pathname: string, basePath: string): EventDetailTab {
  const suffix = trimSlash(pathname).slice(basePath.length);
  if (suffix === "/details") return "details";
  if (suffix === "/programs") return "programs";
  if (suffix === "/exhibitors") return "exhibitors";
  return "attend";
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
  const prefersReducedMotion = useReducedMotion();
  const appLayoutData = useRouteLoaderData("layout/app-layout") as
    | { user: unknown | null }
    | undefined;
  const { event, loadError } = useLoaderData<typeof loader>();
  const location = useLocation();
  const navigation = useNavigation();

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
  const pendingPath = navigation.location
    ? trimSlash(navigation.location.pathname)
    : null;
  const isSwitchingTab =
    navigation.state === "loading" &&
    pendingPath !== null &&
    pendingPath !== trimSlash(location.pathname) &&
    (pendingPath === basePath || pendingPath.startsWith(`${basePath}/`));

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
          <EventDetailCover event={event} isFavorite={event.isFavorite} />
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

        {isSwitchingTab ? (
          <EventDetailTabSkeleton tab={tabFromPath(pendingPath, basePath)} />
        ) : (
          <Outlet
            context={{
              event,
              isAuthenticated: Boolean(appLayoutData?.user),
            }}
          />
        )}
      </main>
    </div>
  );
}
