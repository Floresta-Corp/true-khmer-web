import { CalendarDays, Clock, Globe, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import {
  formatDate,
  formatEventTimeRange,
} from "~/features/events/lib/event-formatters";
import type { EventDetail } from "~/features/events/types/events";

/** Icon tile shared by every row of the card. */
function Row({
  icon,
  align = "center",
  children,
}: {
  icon: ReactNode;
  align?: "center" | "start";
  children: ReactNode;
}) {
  return (
    <div
      className={`flex gap-3.5 ${align === "start" ? "items-start" : "items-center"}`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#D5E2FA] text-[#1C5DD4]">
        {icon}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/**
 * Sidebar "Overview" card: the blurb, when it runs, and where.
 *
 * Multi-day events get a row per day, which is how Plumpi models them even for
 * a single-day event.
 */
export function EventDetailOverview({ event }: { event: EventDetail }) {
  const dates = event.dates ?? [
    { id: event.id, startAt: event.startAt, endAt: event.endAt },
  ];
  const isMultiDay = dates.length > 1;

  return (
    <div className="rounded-[14px] border border-[#E5E7EB] p-6">
      <h3 className="mb-3.5 text-xl font-extrabold text-[#1A1A2E]">Overview</h3>

      {event.excerpt && (
        <p className="mb-5.5 text-[15px] leading-[1.6] text-[#9A9AB0]">
          {event.excerpt}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {isMultiDay ? (
          dates.map((date) => (
            <Row
              key={date.id}
              align="start"
              icon={<CalendarDays className="size-4.5" aria-hidden />}
            >
              <p className="text-[15px] font-bold text-[#1A1A2E]">
                {formatDate(date.startAt)}
              </p>
              <p className="text-[13px] text-[#9A9AB0]">
                {formatEventTimeRange(date.startAt, date.endAt)}
              </p>
            </Row>
          ))
        ) : (
          <>
            <Row icon={<CalendarDays className="size-4.5" aria-hidden />}>
              <span className="text-[15px] font-bold text-[#1A1A2E]">
                {formatDate(event.startAt)}
              </span>
            </Row>
            <Row icon={<Clock className="size-4.5" aria-hidden />}>
              <span className="text-[15px] font-bold text-[#1A1A2E]">
                {formatEventTimeRange(event.startAt, event.endAt)}
              </span>
            </Row>
          </>
        )}

        {event.isOnline && !event.venueName ? (
          <Row icon={<Globe className="size-4.5" aria-hidden />}>
            <span className="text-[15px] font-bold text-[#1A1A2E]">
              Online event
            </span>
          </Row>
        ) : (
          <Row align="start" icon={<MapPin className="size-4.5" aria-hidden />}>
            <p className="mb-0.5 text-[15px] font-bold text-[#1A1A2E]">
              {event.venueName ?? "Location to be announced"}
            </p>
            {event.venueAddress && (
              <p className="text-[13px] text-[#9A9AB0]">{event.venueAddress}</p>
            )}
          </Row>
        )}
      </div>
    </div>
  );
}
