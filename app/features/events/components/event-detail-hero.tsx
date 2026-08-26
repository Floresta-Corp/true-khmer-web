import { Calendar, Heart, Share2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { EventData } from "./event-card";

interface EventDetailHeroProps {
  event: EventData;
}

export function EventDetailHero({ event }: EventDetailHeroProps) {
  const heroImage = event.cover || event.thumbnail;

  return (
    <div className="mx-auto mt-4 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="relative w-full overflow-hidden rounded-2xl bg-gray-200">
        {heroImage ? (
          <img
            src={heroImage}
            alt={event.title}
            className="h-80 w-full object-cover sm:h-96"
          />
        ) : (
          <div className="flex h-80 w-full items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 sm:h-96">
            <Calendar className="h-16 w-16 text-blue-300" />
          </div>
        )}
        {/* Overlay buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart
              className={`h-5 w-5 ${
                event.isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Share2 className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
