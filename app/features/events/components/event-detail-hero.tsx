import { Calendar, Heart, Share2 } from "lucide-react";
import type { EventData } from "./event-card";

interface EventDetailHeroProps {
  event: EventData;
}

export function EventDetailHero({ event }: EventDetailHeroProps) {
  const heroImage = event.cover || event.thumbnail;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="relative w-full rounded-2xl overflow-hidden bg-gray-200">
        {heroImage ? (
          <img
            src={heroImage}
            alt={event.title}
            className="w-full h-85 sm:h-100 object-cover"
          />
        ) : (
          <div className="w-full h-85 sm:h-100 flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
            <Calendar className="w-16 h-16 text-blue-300" />
          </div>
        )}
        {/* Overlay buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <Heart
              className={`w-5 h-5 ${
                event.isFavorite ? "text-red-500 fill-red-500" : "text-gray-600"
              }`}
            />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
