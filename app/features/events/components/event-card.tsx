import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Calendar, MapPin, Heart } from "lucide-react";
import {
  CATEGORY_COLORS,
  formatEventType,
  formatEventDateTime,
} from "~/features/events/lib/event-formatters";

export interface EventData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  thumbnail: string | null;
  cover?: string | null;
  startAt: string;
  endAt: string;
  venueName: string | null;
  eventType: string;
  price?: string;
  ticketStatus?: string;
  isOnline?: boolean;
  isFavorite?: boolean;
  description?: string;
  photos?: string[];
}

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
  const categoryColor =
    CATEGORY_COLORS[event.eventType] || "bg-gray-600 text-white";

  const isFree =
    !event.price || event.price === "Free" || parseFloat(event.price) === 0;
  const isSoldOut = event.ticketStatus === "SOLD_OUT";

  return (
    <Link to={`/events/detail/${event.slug}`} className="group block">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
              <Calendar className="h-12 w-12 text-blue-300" />
            </div>
          )}
          {/* Category badge — top left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge
              className={`${categoryColor} rounded-md border-0 px-2.5 py-1 text-[11px] font-semibold shadow-sm`}
            >
              {formatEventType(event.eventType)}
            </Badge>
            {isSoldOut && (
              <Badge className="rounded-md border-0 bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                Sold Out
              </Badge>
            )}
          </div>
          {/* Favorite button — top right */}
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                event.isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          {/* Date */}
          <div className="mb-2 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">
              {formatEventDateTime(event.startAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-1.5 line-clamp-1 text-base font-bold text-gray-900 transition-colors hover:text-blue-600">
            {event.title}
          </h3>

          {/* Excerpt */}
          {event.excerpt && (
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
              {event.excerpt}
            </p>
          )}

          {/* Bottom row: venue + price */}
          <div className="mt-auto flex items-center justify-between pt-2">
            {event.venueName ? (
              <div className="flex min-w-0 items-center gap-1.5 text-gray-400">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate text-xs">{event.venueName}</span>
              </div>
            ) : event.isOnline ? (
              <div className="flex items-center gap-1.5 text-blue-500">
                <span className="text-xs font-medium">🌐 Online</span>
              </div>
            ) : (
              <div />
            )}
            <span
              className={`shrink-0 text-sm font-bold ${
                isFree ? "text-emerald-500" : "text-blue-600"
              }`}
            >
              {isFree ? "Free" : `$${parseFloat(event.price!).toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
