import { Link } from "react-router";
import { Bookmark, Calendar, MapPin } from "lucide-react";
import { cn } from "~/lib/utils";
import type { EventListItem } from "~/features/events/types/events";
import {
  EVENT_TYPE_COVER_COLORS,
  formatEventDayLabel,
  formatEventTimeRange,
} from "~/features/events/lib/event-formatters";

interface EventListCardProps {
  event: EventListItem;
  isSaved: boolean;
  onToggleSave: (eventId: string) => void;
}

/**
 * Event card used across the public Events listing.
 *
 * Follows the design: 150px cover with the category pill and a save button
 * floating over it, then date, title, blurb, and a divided footer carrying the
 * venue and the price.
 */
export function EventListCard({
  event,
  isSaved,
  onToggleSave,
}: EventListCardProps) {
  const dayLabel = formatEventDayLabel(event.startAt);
  const timeLabel = formatEventTimeRange(event.startAt, event.endAt);
  const isFree = event.price === null || event.price === 0;
  const coverColor =
    EVENT_TYPE_COVER_COLORS[event.eventType] ?? EVENT_TYPE_COVER_COLORS.OTHER;

  return (
    <Link
      to={`/events/detail/${event.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(26,26,46,0.10)]"
    >
      <div
        className="relative h-37.5 shrink-0"
        style={{ backgroundColor: coverColor }}
      >
        {event.thumbnail && (
          <img
            src={event.thumbnail}
            alt=""
            className="size-full object-cover"
            loading="lazy"
          />
        )}

        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className="rounded-full bg-white/92 px-3 py-[5px] text-[11px] font-bold text-[#1A1A2E]">
            {event.categoryLabel}
          </span>
        </div>

        <button
          type="button"
          aria-label={isSaved ? "Remove from saved events" : "Save event"}
          aria-pressed={isSaved}
          onClick={(clickEvent) => {
            clickEvent.preventDefault();
            onToggleSave(event.id);
          }}
          className="absolute top-2.5 right-2.5 flex size-7.5 cursor-pointer items-center justify-center rounded-full bg-white/92 shadow-[0_1px_4px_rgba(0,0,0,0.18)]"
        >
          <Bookmark
            aria-hidden
            className={cn(
              "size-[15px]",
              isSaved
                ? "fill-[#1C5DD4] text-[#1C5DD4]"
                : "fill-none text-[#9A9AB0]",
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-4 pb-4.5">
        <p className="mb-2 flex items-center gap-2 text-[12.5px] text-[#9A9AB0]">
          <Calendar className="size-[13px] shrink-0" aria-hidden />
          <span className="truncate">
            {timeLabel ? `${dayLabel} · ${timeLabel}` : dayLabel}
          </span>
        </p>

        <h3 className="mb-2 line-clamp-2 text-[17px] leading-[1.3] font-bold text-[#1A1A2E]">
          {event.title}
        </h3>

        {event.excerpt && (
          <p className="mb-3.5 line-clamp-2 flex-1 text-[12.5px] text-[#9A9AB0]">
            {event.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2.5 border-t border-[#E5E7EB] pt-3.5">
          <span className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-[#9A9AB0]">
            <MapPin className="size-[13px] shrink-0" aria-hidden />
            <span className="truncate">{event.location}</span>
          </span>
          <span
            className={cn(
              "shrink-0 text-[13px] font-bold",
              isFree ? "text-[#1FC16B]" : "text-[#1C5DD4]",
            )}
          >
            {event.isSoldOut
              ? "Sold out"
              : isFree
                ? "Free"
                : `$${event.price!.toFixed(2)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
