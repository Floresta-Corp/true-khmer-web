import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { EventCategory } from "~/features/events/lib/event-types";
import { Button } from "~/components/ui/button";

interface EventCategoryCarouselProps {
  categories: EventCategory[];
  activeCategoryId: string | null;
}

export function EventCategoryCarousel({
  categories,
  activeCategoryId,
}: EventCategoryCarouselProps) {
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
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white transition-opacity ${
          canScrollLeft
            ? "cursor-pointer opacity-100 hover:bg-gray-50"
            : "cursor-default opacity-30"
        }`}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4 text-gray-600" />
      </Button>

      {/* Scrollable items */}
      <div
        ref={scrollRef}
        className="scrollbar-hide -my-2 flex flex-1 justify-between gap-4 overflow-x-auto px-1 py-2"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;
          const href = isActive
            ? "/events/all"
            : `/events/all?categoryId=${category.id}`;

          return (
            <Link
              key={category.id}
              to={href}
              className="group flex shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all ${
                  isActive
                    ? "bg-blue-100 ring-2 ring-blue-600"
                    : "bg-gray-100 group-hover:bg-gray-200"
                }`}
              >
                {category.icon}
              </span>
              <span
                className={`text-center text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "font-bold text-blue-600"
                    : "text-gray-600 group-hover:text-gray-900"
                }`}
              >
                {category.name}
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
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white transition-opacity ${
          canScrollRight
            ? "cursor-pointer opacity-100 hover:bg-gray-50"
            : "cursor-default opacity-30"
        }`}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4 text-gray-600" />
      </Button>
    </div>
  );
}
