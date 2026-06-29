import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useFetcher, useLocation, useNavigation } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import LaunchpadProjectCard from "../card/launchpad-project-card";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import type { launchpadLoader } from "~/features/launchpad/services/launchpad.loader";
import LaunchpadCardSkeleton from "./launchpad-card-skeleton";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";

interface LaunchpadAvailableOpportunitiesProps {
  projects: LaunchpadOpportunity[];
  nextCursor: string | null;
  onOpenOpportunity: (item: LaunchpadOpportunity) => void;
}

export function LaunchpadAvailableOpportunities({
  projects,
  nextCursor: initialCursor,
  onOpenOpportunity,
}: LaunchpadAvailableOpportunitiesProps) {
  const location = useLocation();
  const fetcher = useFetcher<typeof launchpadLoader>();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);
  const prefersReducedMotion = useReducedMotion();

  const [items, setItems] = useState<LaunchpadOpportunity[]>(projects);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialCursor !== null);

  const loading = fetcher.state === "loading" || fetcher.state === "submitting";
  const isLoading = fetcher.state === "loading";
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
        transition: { duration: cardDuration, ease: "easeIn" as const },
      },
    }),
    [cardDuration, prefersReducedMotion],
  );

  useEffect(() => {
    setItems(projects);
    setCursor(initialCursor);
    setHasMore(initialCursor !== null);
    loadingMoreRef.current = false;
  }, [projects, initialCursor]);

  // Append fetched page
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (!loadingMoreRef.current) return;
    loadingMoreRef.current = false;

    const { projects, nextCursor } = fetcher.data;
    if (projects.length > 0) {
      setItems((prev) => [...prev, ...projects]);
    }
    setCursor(nextCursor ?? null);
    setHasMore(nextCursor !== null);
  }, [fetcher.state, fetcher.data]);

  const activeSort = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("sortBy") || "newest";
  }, [location.search]);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore || !cursor) return;
    loadingMoreRef.current = true;

    const params = new URLSearchParams(location.search);
    params.set("cursor", cursor);
    params.set("sortBy", activeSort);
    fetcher.load(`/launchpad/all?${params.toString()}`);
  }, [isLoading, hasMore, cursor, location.search, activeSort, fetcher]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) loadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const navigation = useNavigation();
  const isRouteLoading = navigation.state !== "idle";

  if (isRouteLoading || (isLoading && items.length === 0)) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <LaunchpadCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  return (
    <>
      <section>
        <div className="mx-auto flex w-full max-w-304 flex-col gap-8">
          {items.length > 0 ? (
            <>
              <motion.div
                className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2"
                variants={listVariants}
                initial="hidden"
                animate="show"
              >
                <AnimatePresence initial={true} mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      layout="position"
                      style={{ willChange: "transform, opacity" }}
                    >
                      <LaunchpadProjectCard
                        item={item}
                        onOpenOpportunity={onOpenOpportunity}
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
                    No Project found
                  </h3>
                  <p className="text-sm leading-6 text-[#64748b]">
                    Try broadening your search or switching categories to see
                    more results.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="h-10 rounded-full border-[#dbe3ee] bg-white px-5 text-sm font-semibold text-[#364153] shadow-[0px_4px_14px_rgba(15,23,42,0.04)] hover:bg-[#f8fafc]"
                >
                  <Link to="/launchpad/all">Clear Search &amp; Browse All</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
