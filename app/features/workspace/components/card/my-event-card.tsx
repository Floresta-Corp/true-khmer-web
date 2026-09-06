import { motion } from "motion/react";
import { CalendarDays, LoaderCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  MY_EVENT_STATUS_LABELS,
  formatMyEventDateRange,
  formatMyEventRevenue,
  formatMyEventTickets,
  formatMyEventTimeRange,
} from "~/features/workspace/lib/my-events-format";
import type {
  MyEvent,
  MyEventStatus,
} from "~/features/workspace/types/my-events";

/** Badge/dot colour per status, from the design system status ramp. */
const STATUS_COLORS: Record<MyEventStatus, string> = {
  ACTIVE: "text-[#FB3748]",
  PUBLISHED: "text-[#1C5DD4]",
  COMPLETED: "text-[oklch(0.5_0.08_152)]",
  CANCELLED: "text-[#FB3748]",
  DRAFT: "text-[#9A9AB0]",
  POSTPONED: "text-[#9A9AB0]",
  ARCHIVED: "text-[#9A9AB0]",
};

function EventStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="mb-0.5 text-[11px] text-[#9A9AB0]">{label}</div>
      <div className="truncate text-[13px] font-bold text-[#1A1A2E]">
        {value}
      </div>
    </div>
  );
}

type Props = {
  event: MyEvent;
  index?: number;
  isOpening?: boolean;
  onOpen: (event: MyEvent) => void;
};

export default function MyEventCard({
  event,
  index = 0,
  isOpening = false,
  onOpen,
}: Props) {
  // Drafts and cancelled events never sell tickets, so their zeroed figures are
  // dropped rather than shown; otherwise the row needs at least one real value.
  const hasStats =
    event.status !== "DRAFT" &&
    event.status !== "CANCELLED" &&
    (event.revenue !== null || event.ticketsSold !== null);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(event)}
      disabled={isOpening}
      aria-label={`Open ${event.title} in Plumpi`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: index * 0.05,
      }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white text-left shadow-[0_1px_3px_rgba(26,26,46,0.06),0_8px_24px_rgba(26,26,46,0.04)] transition-shadow hover:shadow-[0_2px_6px_rgba(26,26,46,0.10),0_12px_32px_rgba(26,26,46,0.08)] focus-visible:ring-2 focus-visible:ring-[#1C5DD4]/40 focus-visible:outline-none disabled:cursor-wait"
    >
      <div className="relative h-32.5 shrink-0 bg-[#F5F6F8]">
        {event.thumbnail ? (
          <img
            src={event.thumbnail}
            alt=""
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-[#9A9AB0]">
            <CalendarDays size={28} />
          </div>
        )}

        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-[5px] text-[12px] font-bold">
          <span
            className={cn(
              "size-1.5 rounded-full bg-current",
              STATUS_COLORS[event.status],
            )}
          />
          <span className={STATUS_COLORS[event.status]}>
            {MY_EVENT_STATUS_LABELS[event.status]}
          </span>
        </span>

        {isOpening && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70">
            <LoaderCircle className="size-6 animate-spin text-[#1C5DD4]" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2.5 line-clamp-2 text-[15px] leading-[1.3] font-bold text-[#1A1A2E]">
          {event.title}
        </div>

        <div className="mb-3 flex flex-col gap-1.5 text-[12.5px] text-[#9A9AB0]">
          <span className="truncate">
            {formatMyEventDateRange(event.startAt, event.endAt)}
          </span>
          <span className="truncate">
            {formatMyEventTimeRange(event.startAt, event.endAt)}
          </span>
          <span className="truncate">{event.location}</span>
        </div>

        {hasStats && (
          <div className="mt-auto flex justify-between gap-2 border-t border-[#E5E7EB] pt-3">
            <EventStat
              label="Revenue"
              value={formatMyEventRevenue(event.revenue, event.currencyCode)}
            />
            <EventStat
              label="Tickets"
              value={formatMyEventTickets(
                event.ticketsSold,
                event.ticketCapacity,
              )}
            />
          </div>
        )}
      </div>
    </motion.button>
  );
}
