import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";

interface Pillar {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

interface PillarsCarouselProps {
  pillars: Pillar[];
}

interface PreviewImageProps {
  pillar: Pillar;
  onClick: () => void;
  direction: "left" | "right";
  onKeyPress: (event: React.KeyboardEvent, action: () => void) => void;
}

const PreviewImage: React.FC<PreviewImageProps> = ({
  pillar,
  onClick,
  direction,
  onKeyPress,
}) => (
  <div className="hidden lg:block">
    <button
      type="button"
      className={clsx(
        "relative h-64 w-28 cursor-pointer overflow-hidden rounded-xl md:h-96",
        "focus:ring-2 focus:ring-[#1c97d4] focus:outline-none",
        "transition-transform duration-200 hover:scale-105",
      )}
      onClick={onClick}
      onKeyDown={(e) => onKeyPress(e, onClick)}
      aria-label={`Go to ${direction === "left" ? "previous" : "next"} slide`}
    >
      <img
        src={pillar.imageUrl}
        alt={pillar.imageAlt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </button>
  </div>
);

const PillarsCarousel: React.FC<PillarsCarouselProps> = ({ pillars }) => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainCardRef = useRef<HTMLDivElement>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  const handleSlideChange = (index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(index);
      setIsTransitioning(false);
    }, 150);
  };
  const goToPrevious = () => {
    const newIndex = activeIndex === 0 ? pillars.length - 1 : activeIndex - 1;
    handleSlideChange(newIndex);
  };

  const goToNext = () => {
    const newIndex = activeIndex === pillars.length - 1 ? 0 : activeIndex + 1;
    handleSlideChange(newIndex);
  };

  const handleKeyPress = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      action();
    }
  };

  const getLeftPreviewIndex = () => {
    return activeIndex === 0 ? pillars.length - 1 : activeIndex - 1;
  };

  const getSecondLeftPreviewIndex = () => {
    const leftIndex = getLeftPreviewIndex();
    return leftIndex === 0 ? pillars.length - 1 : leftIndex - 1;
  };

  const getRightPreviewIndex = () => {
    return activeIndex === pillars.length - 1 ? 0 : activeIndex + 1;
  };

  const activePillar = pillars[activeIndex];

  return (
    <div className="mx-auto mt-12">
      <div className="flex items-center justify-center gap-4 lg:gap-6">
        <div>
          <PreviewImage
            pillar={pillars[getSecondLeftPreviewIndex()]}
            onClick={() => handleSlideChange(getSecondLeftPreviewIndex())}
            direction="left"
            onKeyPress={handleKeyPress}
          />
        </div>
        <div>
          <PreviewImage
            pillar={pillars[getLeftPreviewIndex()]}
            onClick={() => handleSlideChange(getLeftPreviewIndex())}
            direction="left"
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Main Content Card */}
        <div
          ref={mainCardRef}
          className={clsx(
            "bg-base-100 flex h-163 w-full max-w-176.75 flex-col border-2 border-[#1c97d4] md:h-110",
            "overflow-hidden rounded-3xl shadow-[0_35px_60px_-15px_rgba(28,151,212,0.4)]",
          )}
        >
          <div className="hidden min-h-0 flex-1 p-8 md:flex md:flex-row">
            <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-3xl border-3 border-[#1c97d4] md:h-80 md:w-1/2">
              <img
                src={activePillar.imageUrl}
                alt={activePillar.imageAlt}
                className={clsx(
                  "h-full w-full object-cover transition-opacity duration-150",
                  isTransitioning ? "opacity-0" : "opacity-100",
                )}
                loading="lazy"
              />
            </div>

            <div
              className={clsx(
                "flex w-full min-w-0 flex-col items-start justify-center overflow-hidden pt-6 pl-0 md:w-1/2 md:pt-0 md:pl-9",
                "transition-opacity duration-150",
                isTransitioning ? "opacity-0" : "opacity-100",
              )}
            >
              <div className="space-y-4">
                <h3 className="text-2xl leading-tight font-bold text-[#243d95] md:text-3xl">
                  {activePillar.title}
                </h3>
                <p className="text-base leading-relaxed text-gray-500">
                  {activePillar.description}
                </p>
              </div>
            </div>
          </div>

          <div className="block min-h-0 flex-1 overflow-hidden md:hidden">
            <div className="flex h-full flex-col">
              <div className="relative mb-6 h-64 w-full shrink-0 overflow-hidden rounded-3xl border-3 border-[#1c97d4]">
                <img
                  src={activePillar.imageUrl}
                  alt={activePillar.imageAlt}
                  className={clsx(
                    "h-full w-full object-cover transition-opacity duration-150",
                    isTransitioning ? "opacity-50" : "opacity-100",
                  )}
                  loading="lazy"
                />
              </div>

              <div
                className={clsx(
                  "min-h-0 flex-1 overflow-hidden transition-opacity duration-150",
                  isTransitioning ? "opacity-50" : "opacity-100",
                )}
              >
                <div className="space-y-4">
                  <h3 className="text-2xl leading-tight font-bold text-[#243d95] md:text-3xl">
                    {activePillar.title}
                  </h3>
                  <p className="text-base leading-relaxed text-gray-500">
                    {activePillar.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Numbered Pagination - visible on all screens */}
          <div className="flex shrink-0 justify-center gap-2 px-8 pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="border hover:border-[#167fb4] hover:bg-[#268bbd] hover:text-white"
              aria-label="Previous slide"
              disabled={isTransitioning}
            >
              <ChevronLeft />
            </Button>
            {pillars.map((pillar, index) => (
              <button
                key={pillar.id}
                type="button"
                onClick={() => handleSlideChange(index)}
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-200",
                  "focus:ring-2 focus:ring-[#1c97d4] focus:ring-offset-1 focus:outline-none",
                  activeIndex === index
                    ? "bg-[#1c97d4] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-300",
                )}
                aria-label={`Go to slide ${index + 1}`}
                disabled={isTransitioning}
              >
                {index + 1}
              </button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="border hover:border-[#167fb4] hover:bg-[#268bbd] hover:text-white"
              aria-label="Next slide"
              disabled={isTransitioning}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        <div>
          <PreviewImage
            pillar={pillars[getRightPreviewIndex()]}
            onClick={() => handleSlideChange(getRightPreviewIndex())}
            direction="right"
            onKeyPress={handleKeyPress}
          />
        </div>
      </div>
    </div>
  );
};

export default PillarsCarousel;
