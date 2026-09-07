import { Search } from "lucide-react";
import { Link, useFetcher, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import type { Opportunity } from "~/features/volunteer/types/volunteer-types";
import type { Pagination } from "~/services/types";
import OpportunityCardSkeleton from "../../sections/opportunity-card-skeleton";
import { OpportunityCard } from "~/components/opportunity-card";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "~/lib/utils";

const DEFAULT_LIMIT = 6;

interface VolunteerAvailableOpportunitiesProps {
  opportunities?: Opportunity[];
  pagination?: Pagination;
  showHeader?: boolean;
  className?: string;
  /**
   * Width/gutters for the inner content. Pass `"site-container"` to line the
   * grid up with the navbar and footer; the default keeps the legacy width for
   * pages that embed this section inside their own container.
   */
  containerClassName?: string;
  isLoading?: boolean;
  onMutationComplete?: () => void;
  limit?: number;
}

export function VolunteerAvailableOpportunities({
  opportunities: initialOpportunities = [],
  pagination: initialPagination,
  showHeader = true,
  className = "",
  containerClassName = "mx-auto w-full max-w-304",
  isLoading: externalLoading = false,
  onMutationComplete,
  limit = DEFAULT_LIMIT,
}: VolunteerAvailableOpportunitiesProps) {
  const location = useLocation();
  const fetcher = useFetcher();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [items, setItems] = useState<Opportunity[]>(initialOpportunities);
  const [hasMore, setHasMore] = useState(
    initialPagination?.hasMore ?? initialOpportunities.length >= limit,
  );
  const [cursor, setCursor] = useState<string | null>(
    initialPagination?.nextCursor ?? null,
  );
  const loadingMoreRef = useRef(false);

  const loading = fetcher.state === "loading" || fetcher.state === "submitting";
  const isLoading = externalLoading || loading;
  const cardStagger = prefersReducedMotion ? 0 : 0.03;
  const cardDuration = prefersReducedMotion ? 0 : 0.2;

  const listVariants = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: {
          staggerChildren: cardStagger,
          delayChildren: prefersReducedMotion ? 0 : 0.01,
        },
      },
    }),
    [cardStagger, prefersReducedMotion],
  );

  const cardVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : 18,
        scale: prefersReducedMotion ? 1 : 0.98,
      },
      show: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: cardDuration,
          ease: "easeOut" as const,
          delay: prefersReducedMotion ? 0 : index * 0.008,
        },
      }),
      exit: {
        opacity: 0,
        y: prefersReducedMotion ? 0 : -12,
        scale: prefersReducedMotion ? 1 : 0.98,
        transition: {
          duration: cardDuration,
          ease: "easeIn" as const,
        },
      },
    }),
    [cardDuration, prefersReducedMotion],
  );

  useEffect(() => {
    setItems(initialOpportunities);
    setCursor(initialPagination?.nextCursor ?? null);
    setHasMore(
      initialPagination?.hasMore ?? initialOpportunities.length >= limit,
    );
    loadingMoreRef.current = false;
  }, [initialOpportunities, initialPagination, limit]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;

    loadingMoreRef.current = true;

    const params = new URLSearchParams(location.search);
    params.set("limit", String(limit));
    if (cursor) params.set("cursor", cursor);

    const fetchUrl = `${location.pathname}?${params.toString()}`;
    fetcher.load(fetchUrl);
  }, [
    loading,
    hasMore,
    cursor,
    location.search,
    location.pathname,
    limit,
    fetcher,
  ]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (!loadingMoreRef.current) return;
    loadingMoreRef.current = false;

    const data = fetcher.data as {
      opportunities?: Opportunity[];
      pagination?: Pagination;
    };

    if (data.opportunities && data.opportunities.length > 0) {
      setItems((prev) => [...prev, ...data.opportunities!]);
    }

    if (data.pagination) {
      setCursor(data.pagination.nextCursor);
      setHasMore(data.pagination.hasMore);
    } else {
      setHasMore(false);
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <section
      className={className || "w-full bg-gray-50 px-6 py-10 md:px-12 lg:px-28"}
    >
      <div className={cn("flex flex-col gap-8", containerClassName)}>
        {showHeader && (
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl leading-snug font-bold text-[#020618] md:text-[22px] md:leading-12">
              Available Opportunities
            </h2>

            <Button
              asChild
              type="button"
              variant="ghost"
              className="h-9 shrink-0 px-4 text-sm text-blue-500 hover:bg-transparent hover:text-blue-700 hover:underline"
            >
              <Link to="/volunteer/all">View all</Link>
            </Button>
          </div>
        )}

        {isLoading && items.length === 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <OpportunityCardSkeleton key={`opportunity-skeleton-${index}`} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
              variants={listVariants}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence initial={true} mode="popLayout">
                {items.map((opportunity, index) => (
                  <motion.div
                    key={opportunity.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    layout="position"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <OpportunityCard
                      opportunity={opportunity}
                      onMutationComplete={onMutationComplete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMore && (
              <div className="flex justify-center pt-2">
                {loading ? (
                  <Button
                    type="button"
                    variant="outline"
                    disabled
                    className="h-10 rounded-xl border-[#dbe3ee] px-6"
                  >
                    Loading...
                  </Button>
                ) : (
                  <div ref={sentinelRef} className="h-10" />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex min-h-96 items-center justify-center rounded-[18px] border border-dashed border-[#e5e7eb] bg-white px-6 py-12 text-center">
            <div className="flex max-w-sm flex-col items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full border border-[#edf2f7] bg-[#fafbff] text-[#cbd5e1] shadow-[0px_6px_18px_rgba(15,23,42,0.04)]">
                <Search className="size-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#020618]">
                  No opportunities found
                </h3>
                <p className="text-sm leading-6 text-[#64748b]">
                  Try broadening your search or switching categories to see more
                  results.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-full border-[#dbe3ee] bg-white px-5 text-sm font-semibold text-[#364153] shadow-[0px_4px_14px_rgba(15,23,42,0.04)] hover:bg-[#f8fafc]"
              >
                <Link to="/volunteer/all">Clear Search &amp; Browse All</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
