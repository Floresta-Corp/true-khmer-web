import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, MotionConfig } from "motion/react";
import { cn } from "~/lib/utils";
import { slideUpVariants, staggerContainerVariants } from "./home-motion";

interface HomeCarouselSectionProps {
  title: string;
  className?: string;
  trailing?: ReactNode;
  children: ReactNode;
}

export function HomeCarouselSection({
  title,
  className,
  trailing,
  children,
}: HomeCarouselSectionProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const maxScrollLeft = row.scrollWidth - row.clientWidth;
    setCanScrollLeft(row.scrollLeft > 1);
    setCanScrollRight(row.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    updateScrollState();
    row.addEventListener("scroll", updateScrollState, { passive: true });
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(row);
    return () => {
      row.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [updateScrollState]);

  const scrollBy = (direction: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({
      left: direction * row.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        className={cn("py-6 lg:py-8", className)}
        variants={staggerContainerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="site-container">
          <motion.div
            variants={slideUpVariants}
            className="mb-9 flex items-center justify-between gap-4"
          >
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#333333] sm:text-[36px] sm:leading-11">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              <ArrowButton
                label="Scroll left"
                onClick={() => scrollBy(-1)}
                disabled={!canScrollLeft}
                icon={<ChevronLeft className="size-5" />}
              />
              <ArrowButton
                label="Scroll right"
                onClick={() => scrollBy(1)}
                disabled={!canScrollRight}
                icon={<ChevronRight className="size-5" />}
              />
            </div>
          </motion.div>

          <div
            ref={rowRef}
            className="-mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-5 overflow-x-auto overflow-y-hidden px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:scroll-pl-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {children}
            {trailing}
          </div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}

function ArrowButton({
  label,
  onClick,
  disabled,
  icon,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center rounded-lg border border-[#e9eaeb] bg-white p-3 text-[#454a53] transition-colors hover:border-[#2f6fe4] hover:text-[#2f6fe4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#e9eaeb] disabled:hover:text-[#454a53]"
    >
      {icon}
    </button>
  );
}
