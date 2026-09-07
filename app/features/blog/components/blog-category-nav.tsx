import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

type BlogCategoryNavProps = {
  categories: BlogCategory[];
  activeCategory: BlogCategory | null;
  buildHref: (slug?: string) => string;
};

const PILL_BASE =
  "inline-flex shrink-0 items-center rounded-full px-6 py-2.5 text-sm leading-5 font-semibold transition";
const PILL_ACTIVE = "bg-blue-500 text-white shadow-md shadow-blue-500/30";
const PILL_IDLE =
  "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300";

export function BlogCategoryNav({
  categories,
  activeCategory,
  buildHref,
}: BlogCategoryNavProps) {
  const scrollerRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth - 1;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < maxScrollLeft);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    const observer = new ResizeObserver(syncScrollState);
    observer.observe(el);
    for (const child of el.children) observer.observe(child);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      observer.disconnect();
    };
  }, [syncScrollState, categories]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !activeCategory) return;
    const pill = el.querySelector(`[data-category-id="${activeCategory.id}"]`);
    pill?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [activeCategory]);

  const isScrollable = canScrollLeft || canScrollRight;

  function scrollByStep(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth * 0.8,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className="relative flex min-w-0 flex-1 items-center gap-4">
      {isScrollable ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden rounded-full sm:inline-flex"
          onClick={() => scrollByStep(-1)}
          disabled={!canScrollLeft}
          aria-label="Scroll categories left"
        >
          <ChevronLeft />
        </Button>
      ) : null}
      <nav
        ref={scrollerRef}
        className="-mx-1 -my-3 flex touch-pan-x items-center gap-3 overflow-x-auto overscroll-x-contain px-2 py-3 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Blog categories"
      >
        <Link
          to={buildHref()}
          className={cn(PILL_BASE, activeCategory ? PILL_IDLE : PILL_ACTIVE)}
        >
          All blogs
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={buildHref(category.slug)}
            data-category-id={category.id}
            className={cn(
              PILL_BASE,
              activeCategory?.id === category.id ? PILL_ACTIVE : PILL_IDLE,
            )}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      {isScrollable ? (
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="hidden rounded-full sm:inline-flex"
          onClick={() => scrollByStep(1)}
          disabled={!canScrollRight}
          aria-label="Scroll categories right"
        >
          <ChevronRight />
        </Button>
      ) : null}

      {canScrollRight ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l sm:hidden dark:from-slate-950" />
      ) : null}
    </div>
  );
}
