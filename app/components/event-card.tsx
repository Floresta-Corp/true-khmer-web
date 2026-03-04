import { Link } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Calendar, MapPin, Clock } from "lucide-react";

export interface EventData {
  id: string;
  title: string;
  excerpt: string;
  thumbnail: string | null;
  startAt: string;
  endAt: string;
  venueName: string | null;
  eventType: string;
  price?: string;
  description?: string; // ✅ added — used by the detail page
}

interface EventCardProps {
  event: EventData;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Khmer Talks": "bg-accent text-accent-foreground",
  "Discover Khmer": "bg-secondary text-secondary-foreground",
  "Networking Events": "bg-primary text-primary-foreground",
  "Ambassador Dinners": "bg-muted text-muted-foreground",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventCard({ event }: EventCardProps) {
  const categoryColor =
    CATEGORY_COLORS[event.eventType] || "bg-muted text-muted-foreground";

  return (
    <Link to={`/events/${event.id}`}>
      <Card className="overflow-hidden hover:shadow-d transition-shadow cursor-pointer h-full rounded-lg">
        <div className="relative w-full h-48 bg-muted overflow-hidden">
          {event.thumbnail ? (
            <img
              src={event.thumbnail}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge
              className={`${categoryColor} border-0 text-xs font-semibold rounded-full px-3 py-1`}
            >
              {event.eventType}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground">
            {event.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.startAt)}</span>
            <Clock className="w-4 h-4 ml-2" />
            <span>{formatTime(event.startAt)}</span>
          </div>

          {event.venueName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{event.venueName}</span>
            </div>
          )}

          {event.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {event.excerpt}
            </p>
          )}

          {event.price && (
            <p className="text-sm font-semibold text-primary mt-2">
              {event.price === "Free" ? "Free" : `from $${event.price}`}
            </p>
          )}

          <div className="mt-4 text-primary font-semibold text-sm hover:underline">
            View Details →
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}