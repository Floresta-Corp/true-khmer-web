import { Link } from "react-router";
import { motion } from "motion/react";
import {
  BarChart3,
  CalendarDays,
  Globe,
  MapPin,
  Ticket,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import {
  MY_EVENT_FORMAT_LABELS,
  MY_EVENT_STATUS_LABELS,
  formatMyEventAttendance,
  formatMyEventDateTime,
  formatMyEventRevenue,
  formatMyEventTickets,
} from "~/features/workspace/lib/my-events-format";
import type {
  MyEvent,
  MyEventFormat,
  MyEventStatus,
} from "~/features/workspace/types/my-events";
import MyEventOption from "../dropdown/my-event-option";

const STATUS_STYLES: Record<MyEventStatus, string> = {
  LIVE: "bg-red-50 text-red-600 border-red-100",
  PUBLISHED: "bg-blue-50 text-blue-700 border-blue-100",
  ENDED: "bg-green-50 text-green-700 border-green-100",
  CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
  DRAFT: "bg-gray-100 text-gray-700 border-gray-200",
};

const STATUS_DOTS: Record<MyEventStatus, string> = {
  LIVE: "bg-red-500",
  PUBLISHED: "bg-blue-600",
  ENDED: "bg-green-600",
  CANCELLED: "bg-slate-400",
  DRAFT: "bg-gray-400",
};

const FORMAT_ICONS: Record<MyEventFormat, LucideIcon> = {
  IN_PERSON: MapPin,
  ONLINE: Video,
  HYBRID: Globe,
};

function EventStat({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col items-center", className)}>
      <span className="flex items-center gap-1 text-[9px] font-black tracking-widest text-slate-500 uppercase">
        <Icon className="size-3" />
        {label}
      </span>
      <span className="mt-1 truncate text-xl leading-none font-semibold text-black">
        {value}
      </span>
    </div>
  );
}

type Props = {
  event: MyEvent;
  index?: number;
};

export default function MyEventCard({ event, index = 0 }: Props) {
  const FormatIcon = FORMAT_ICONS[event.format];
  const isDraft = event.status === "DRAFT";
  // A draft has nothing published to look at yet, so it re-opens the basics
  // step. Everything else deep-links to the live event page.
  // TODO: point published events at the Plumpi organizer console once the
  // handoff URL is returned by the API.
  const primaryHref = isDraft
    ? "/my-events/create"
    : `/events/detail/${event.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.05,
      }}
      className="h-full"
    >
      <div className="group relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-200/60">
        <div className="flex items-center gap-3 p-1">
          <div className="flex size-9 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
            <FormatIcon size={18} />
          </div>
          <span className="truncate text-[11px] font-black tracking-[0.18em] text-slate-900 uppercase">
            {MY_EVENT_FORMAT_LABELS[event.format]}
          </span>
          <div className="ml-auto">
            <MyEventOption event={event} />
          </div>
        </div>

        <div className="relative mt-5 aspect-[2.55/1] overflow-hidden rounded-2xl bg-slate-100">
          {event.coverImageKey ? (
            <img
              src={event.coverImageKey}
              alt={event.title}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-blue-50 via-slate-100 to-emerald-50 text-blue-500">
              <CalendarDays size={34} />
            </div>
          )}

          <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black tracking-wider text-slate-700 uppercase shadow-sm backdrop-blur-sm">
            {event.category}
          </span>

          <span
            className={cn(
              "absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black tracking-wider uppercase shadow-sm",
              STATUS_STYLES[event.status],
            )}
          >
            <span
              className={cn("size-1.5 rounded-full", STATUS_DOTS[event.status])}
            />
            {MY_EVENT_STATUS_LABELS[event.status]}
          </span>
        </div>

        <div className="mt-5 min-h-19 grow space-y-2">
          <h3 className="line-clamp-1 text-xl leading-tight font-bold text-black transition-colors group-hover:text-blue-600">
            {event.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
            {event.description ?? "No description provided."}
          </p>
        </div>

        <div className="mt-4 space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-slate-400" />
            <span className="truncate">
              {formatMyEventDateTime(event.startAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-slate-400" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="grid grid-cols-3">
            <EventStat
              label="Revenue"
              icon={BarChart3}
              value={formatMyEventRevenue(event.revenue, event.currencyCode)}
            />
            <EventStat
              label="Tickets"
              icon={Ticket}
              className="border-x border-slate-200"
              value={formatMyEventTickets(
                event.ticketsSold,
                event.ticketCapacity,
              )}
            />
            <EventStat
              label="Attendance"
              icon={Users}
              value={formatMyEventAttendance(event.attendanceCount)}
            />
          </div>
        </div>

        <div className="mt-5">
          <Button
            variant="outline"
            className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-semibold tracking-wider text-slate-500 transition-all hover:bg-blue-600 hover:text-white active:scale-[0.98]"
            asChild
          >
            <Link to={primaryHref}>
              {isDraft ? "Continue setup" : "Manage Event"}
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
