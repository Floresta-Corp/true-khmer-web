import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { EVENT_TYPES, type EventType } from "~/features/events/lib/event-types";
import { formatEventType } from "~/features/events/lib/event-formatters";

const EVENT_TYPE_META: Record<EventType, { icon: string; color: string }> = {
  CONFERENCE: { icon: "🎤", color: "#4F46E5" },
  WORKSHOP: { icon: "🛠️", color: "#9333EA" },
  SEMINAR: { icon: "📚", color: "#2563EB" },
  CONCERT: { icon: "🎵", color: "#DB2777" },
  FESTIVAL: { icon: "🎉", color: "#D97706" },
  EXHIBITION: { icon: "🖼️", color: "#0D9488" },
  NETWORKING: { icon: "🤝", color: "#2563EB" },
  TRAINING: { icon: "🏋️", color: "#16A34A" },
  WEBINAR: { icon: "💻", color: "#0891B2" },
  OTHER: { icon: "📌", color: "#6B7280" },
};

interface EventTypeCarouselProps {
  activeEventType: string | null;
}

export function EventTypeCarousel({ activeEventType }: EventTypeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 200;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex items-center gap-2">
      {/* Left arrow */}
      <Button
        type="button"
        onClick={() => scroll("left")}
        variant="ghost"
        size="icon"
        className={`shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-opacity ${
          canScrollLeft
            ? "opacity-100 hover:bg-gray-50 cursor-pointer"
            : "opacity-30 cursor-default"
        }`}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </Button>

      {/* Scrollable items */}
      <div
        ref={scrollRef}
        className="flex-1 flex justify-between gap-4 overflow-x-auto scrollbar-hide py-1"
      >
        {EVENT_TYPES.map((type) => {
          const meta = EVENT_TYPE_META[type];
          const isActive = activeEventType === type;
          const href = isActive
            ? "/events/all"
            : `/events/all?eventType=${type}`;

          return (
            <Link
              key={type}
              to={href}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <span
                className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                  isActive
                    ? "bg-blue-100 ring-2 ring-blue-600"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}
              >
                {meta.icon}
              </span>
              <span
                className={`text-xs font-medium text-center whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-blue-600 font-bold"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              >
                {formatEventType(type)}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Right arrow */}
      <Button
        type="button"
        onClick={() => scroll("right")}
        variant="ghost"
        size="icon"
        className={`shrink-0 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center transition-opacity ${
          canScrollRight
            ? "opacity-100 hover:bg-gray-50 cursor-pointer"
            : "opacity-30 cursor-default"
        }`}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </Button>
    </div>
  );
}
