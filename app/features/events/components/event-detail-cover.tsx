import { useState } from "react";
import { Bookmark, Share2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { EVENT_TYPE_COVER_COLORS } from "~/features/events/lib/event-formatters";
import type { EventDetail } from "~/features/events/types/events";

interface EventDetailCoverProps {
  event: EventDetail;
  isSaved: boolean;
  onToggleSave: () => void;
}

const CIRCLE_BUTTON =
  "flex size-11 cursor-pointer items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]";

/** Cover panel of the event detail screen: photo, category pill, save, share. */
export function EventDetailCover({
  event,
  isSaved,
  onToggleSave,
}: EventDetailCoverProps) {
  const [shareLabel, setShareLabel] = useState<string | null>(null);
  const coverColor =
    EVENT_TYPE_COVER_COLORS[event.eventType] ?? EVENT_TYPE_COVER_COLORS.OTHER;

  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, url });
        return;
      } catch {
        // Cancelled, or sharing is blocked — fall through to the clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareLabel("Link copied");
      window.setTimeout(() => setShareLabel(null), 2000);
    } catch {
      setShareLabel("Could not copy the link");
      window.setTimeout(() => setShareLabel(null), 2000);
    }
  };

  return (
    <div
      className="relative mb-7 h-70 overflow-hidden rounded-2xl sm:h-105"
      style={{ backgroundColor: coverColor }}
    >
      {event.cover && (
        <img src={event.cover} alt="" className="size-full object-cover" />
      )}

      <span className="absolute top-5 left-5 rounded-full bg-white px-4.5 py-2 text-sm font-bold text-[#1C5DD4]">
        {event.categoryLabel}
      </span>

      <div className="absolute top-5 right-5 flex items-center gap-2.5">
        {shareLabel && (
          <span
            role="status"
            className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#1A1A2E] shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
          >
            {shareLabel}
          </span>
        )}
        <button
          type="button"
          onClick={onToggleSave}
          aria-label={isSaved ? "Remove from saved events" : "Save event"}
          aria-pressed={isSaved}
          className={CIRCLE_BUTTON}
        >
          <Bookmark
            aria-hidden
            className={cn(
              "size-4.5",
              isSaved
                ? "fill-[#1C5DD4] text-[#1C5DD4]"
                : "fill-none text-[#1A1A2E]",
            )}
          />
        </button>
        <button
          type="button"
          onClick={share}
          aria-label="Share this event"
          className={CIRCLE_BUTTON}
        >
          <Share2 className="size-4.5 text-[#1A1A2E]" aria-hidden />
        </button>
      </div>
    </div>
  );
}
