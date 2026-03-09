import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Calendar, MapPin, Heart } from "lucide-react";

export interface EventData {
  id: string;
  title: string;
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

const CATEGORY_COLORS: Record<string, string> = {
  NETWORKING: "bg-blue-600 text-white",
  WORKSHOP: "bg-purple-600 text-white",
  CULTURAL: "bg-orange-500 text-white",
  CONCERT: "bg-pink-600 text-white",
  EXHIBITION: "bg-teal-600 text-white",
  CONFERENCE: "bg-indigo-600 text-white",
  FESTIVAL: "bg-amber-500 text-white",
};

function formatEventType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
}

function formatEventDateTime(dateString: string): string {
  const date = new Date(dateString);
  const day = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} • ${time}`;
}

export function EventCard({ event }: EventCardProps) {
  const categoryColor =
    CATEGORY_COLORS[event.eventType] || "bg-gray-600 text-white";

  const isFree =
    !event.price || event.price === "Free" || parseFloat(event.price) === 0;
  const isSoldOut = event.ticketStatus === "SOLD_OUT";

  return (
    <Link to={`/events/${event.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative w-full aspect-4/3 bg-gray-100 overflow-hidden">
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
              <Calendar className="w-12 h-12 text-blue-300" />
            </div>
          )}
          {/* Category badge — top left */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge
              className={`${categoryColor} border-0 text-[11px] font-semibold rounded-md px-2.5 py-1 shadow-sm`}
            >
              {formatEventType(event.eventType)}
            </Badge>
            {isSoldOut && (
              <Badge className="bg-red-500 text-white border-0 text-[11px] font-semibold rounded-md px-2.5 py-1 shadow-sm">
                Sold Out
              </Badge>
            )}
          </div>
          {/* Favorite button — top right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                event.isFavorite
                  ? "text-red-500 fill-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Date */}
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">
              {formatEventDateTime(event.startAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-gray-900 mb-1.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>

          {/* Excerpt */}
          {event.excerpt && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
              {event.excerpt}
            </p>
          )}

          {/* Bottom row: venue + price */}
          <div className="mt-auto flex items-center justify-between pt-2">
            {event.venueName ? (
              <div className="flex items-center gap-1.5 text-gray-400 min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs truncate">{event.venueName}</span>
              </div>
            ) : event.isOnline ? (
              <div className="flex items-center gap-1.5 text-blue-500">
                <span className="text-xs font-medium">🌐 Online</span>
              </div>
            ) : (
              <div />
            )}
            <span
              className={`text-sm font-bold shrink-0 ${
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
