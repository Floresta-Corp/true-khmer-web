import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Archive,
  BarChart3,
  Calendar,
  Globe,
  LayoutGrid,
  List,
  Search,
  EllipsisVertical,
  Plus,
  Ticket,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type EventStatus = "Live" | "Published" | "Ended" | "Cancelled" | "Draft";

type MyEvent = {
  id: string;
  title: string;
  status: EventStatus;
  archived?: boolean;
  cover: string;
  date: string;
  time: string;
  venue: string;
  kind: string;
  revenue: string;
  tickets: string;
  attendance?: string;
};

const EVENTS: MyEvent[] = [
  {
    id: "global-wellness-session",
    title: "Global Wellness Session",
    status: "Live",
    cover: "/images/background.jpg",
    date: "Thu, Mar 12",
    time: "8:00 GMT+7",
    venue: "Virtual Event",
    kind: "Hybrid Event",
    revenue: "$1,200",
    tickets: "342/600",
  },
  {
    id: "event-testing",
    title: "Event Testing",
    status: "Draft",
    cover: "/images/forum-avatar.jpg",
    date: "Thu, Mar 12",
    time: "8:00 GMT+7",
    venue: "Virtual Event",
    kind: "In-person",
    revenue: "—",
    tickets: "—",
  },
  {
    id: "global-wellness-session-2",
    title: "Global Wellness Session",
    status: "Published",
    cover: "/images/hero-background-image.webp",
    date: "Thu, Mar 12",
    time: "8:00 GMT+7",
    venue: "Virtual Event",
    kind: "Hybrid Event",
    revenue: "$1,200",
    tickets: "342/600",
  },
  {
    id: "cambodia-global-virtual-launch-2025",
    title: "Cambodia Global Virtual Launch 2025",
    status: "Ended",
    archived: true,
    cover: "/images/phnom-penh-skyline.jpg",
    date: "Thu, Mar 12",
    time: "8:00 GMT+7",
    venue: "Virtual Event",
    kind: "Conference",
    revenue: "$100",
    tickets: "90/100",
    attendance: "90",
  },
];

const STATUS_TABS: Array<{ key: "all" | EventStatus; label: string }> = [
  { key: "all", label: "All" },
  { key: "Published", label: "Published" },
  { key: "Ended", label: "Ended" },
  { key: "Cancelled", label: "Cancelled" },
  { key: "Draft", label: "Draft" },
];

const statusTone: Record<EventStatus, string> = {
  Live: "bg-[#FFF3F3] text-[#E5484D]",
  Published: "bg-[#EDF4FF] text-[#2F6FE4]",
  Ended: "bg-[#EBFBF0] text-[#16803C]",
  Cancelled: "bg-[#F8FAFC] text-[#64748B]",
  Draft: "bg-[#F7F7FB] text-[#3E4C59]",
};

function StatItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] text-[#9AA7B8]">
        <Icon className="size-3.5 shrink-0" />
        <span>{label}</span>
      </div>
      <div className="mt-0.5 truncate text-sm font-semibold text-[#19212F]">
        {value}
      </div>
    </div>
  );
}

function EventCard({
  event,
  viewMode,
}: {
  event: MyEvent;
  viewMode: "grid" | "list";
}) {
  const isList = viewMode === "list";

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[20px] border border-[#E7ECF3] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition-transform hover:-translate-y-0.5",
        isList ? "md:flex md:flex-row" : "flex flex-col",
        event.archived && "opacity-80",
      )}
    >
      <div
        className={cn(
          "relative shrink-0 overflow-hidden",
          isList ? "md:w-72" : "w-full",
        )}
      >
        <img
          src={event.cover}
          alt={event.title}
          className={cn(
            "h-full w-full object-cover",
            isList ? "aspect-4/3 md:aspect-auto md:h-full" : "aspect-4/3",
          )}
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge
            className={cn(
              "rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold shadow-sm hover:bg-white",
              statusTone[event.status],
            )}
          >
            <span className="inline-flex items-center gap-1">
              <span
                className={cn(
                  "size-2 rounded-full",
                  event.status === "Live"
                    ? "bg-[#F04444]"
                    : event.status === "Published"
                      ? "bg-[#2F6FE4]"
                      : event.status === "Ended"
                        ? "bg-[#17A34A]"
                        : "bg-[#94A3B8]",
                )}
              />
              {event.status}
            </span>
          </Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/90 text-[#64748B] shadow-sm hover:bg-white"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </div>

      <CardContent className={cn("flex-1 p-4", isList ? "md:p-5" : "")}>
        <div className="flex h-full flex-col">
          <div className="min-w-0">
            <h3 className="truncate text-[20px] leading-tight font-semibold text-[#182031]">
              {event.title}
            </h3>
            <div className="mt-3 space-y-2 text-sm text-[#7B8BA0]">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 shrink-0" />
                <span>
                  {event.date} • {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="size-4 shrink-0" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border-t border-[#EEF2F7] pt-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatItem
                label="Revenue"
                value={event.revenue}
                icon={BarChart3}
              />
              <StatItem label="Tickets" value={event.tickets} icon={Ticket} />
              <StatItem
                label="Attendance"
                value={event.attendance ?? "—"}
                icon={Users}
              />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 text-sm text-[#7B8BA0]">
                <FileText className="size-4" />
                <span>{event.kind}</span>
              </div>
              {event.archived && (
                <span className="text-xs font-medium tracking-[0.12em] text-[#9AA7B8] uppercase">
                  Archived
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyEventsPage() {
  const prefersReducedMotion = useReducedMotion();
  const [statusFilter, setStatusFilter] = useState<"all" | EventStatus>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showArchived, setShowArchived] = useState(false);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return EVENTS.filter((event) => {
      const matchesStatus =
        statusFilter === "all" ? true : event.status === statusFilter;
      const matchesArchived = showArchived
        ? Boolean(event.archived)
        : !event.archived;
      const matchesSearch =
        !query ||
        [event.title, event.kind, event.venue, event.status]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));

      return matchesStatus && matchesArchived && matchesSearch;
    });
  }, [search, showArchived, statusFilter]);

  return (
    <WorkSpacePageLayout
      title="My Events"
      subtitle="Manage all your events in one place"
      action={
        <Button className="h-11 rounded-xl bg-[#2F6FE4] px-4 text-sm font-medium text-white shadow-none hover:bg-[#245fce]">
          <Plus className="mr-2 size-4" />
          New Event
        </Button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.28,
          delay: prefersReducedMotion ? 0 : 0.04,
        }}
        className="mt-2 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] shadow-sm hover:bg-white">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#FF4D4F]" />
              Live
            </span>
          </Badge>

          <div className="flex flex-wrap items-center gap-1 rounded-full bg-white p-1 shadow-sm">
            {STATUS_TABS.map((tab) => {
              const active = statusFilter === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setStatusFilter(tab.key)}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#EFF5FF] text-[#2F6FE4]"
                      : "text-[#6B7280] hover:text-[#182031]",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowArchived((value) => !value)}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-full border border-transparent bg-white px-4 text-sm font-medium shadow-sm transition-colors",
              showArchived
                ? "text-[#2F6FE4]"
                : "text-[#64748B] hover:text-[#182031]",
            )}
          >
            <Archive className="size-4" />
            Archived
          </button>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative w-full md:w-90">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[#C3CEDA]" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="h-11 rounded-full border-white bg-white pr-4 pl-11 shadow-sm placeholder:text-[#C3CEDA]"
            />
          </div>

          <div className="inline-flex h-11 items-center rounded-full bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full transition-colors",
                viewMode === "grid"
                  ? "bg-[#EFF5FF] text-[#2F6FE4]"
                  : "text-[#94A3B8] hover:text-[#182031]",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "inline-flex size-9 items-center justify-center rounded-full transition-colors",
                viewMode === "list"
                  ? "bg-[#EFF5FF] text-[#2F6FE4]"
                  : "text-[#94A3B8] hover:text-[#182031]",
              )}
              aria-label="List view"
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          delay: prefersReducedMotion ? 0 : 0.08,
        }}
        className={cn(
          "mt-5 grid gap-4",
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
            : "grid-cols-1",
        )}
      >
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.24,
              delay: prefersReducedMotion ? 0 : index * 0.03,
            }}
          >
            <EventCard event={event} viewMode={viewMode} />
          </motion.div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-[#D8E3F4] bg-white px-6 py-16 text-center text-[#6B7C93] shadow-sm">
            No events match the current filters.
          </div>
        )}
      </motion.div>
    </WorkSpacePageLayout>
  );
}
