import { Link, useFetcher, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import type { Opportunity } from "~/services/volunteer/volunteer-types";
import type { Pagination } from "~/services/types";
import OpportunityCardSkeleton from "../../components/sections/opportunity-card-skeleton";
import { OpportunityCard } from "~/components/opportunity-card";
import { useEffect, useRef, useState, useCallback } from "react";

const DEFAULT_LIMIT = 6;

interface VolunteerAvailableOpportunitiesProps {
  opportunities?: Opportunity[];
  pagination?: Pagination;
  showHeader?: boolean;
  className?: string;
  isLoading?: boolean;
  onMutationComplete?: () => void;
  limit?: number;
}

export function VolunteerAvailableOpportunities({
  opportunities: initialOpportunities = [],
  pagination: initialPagination,
  showHeader = true,
  className = "",
  isLoading: externalLoading = false,
  onMutationComplete,
  limit = DEFAULT_LIMIT,
}: VolunteerAvailableOpportunitiesProps) {
  const location = useLocation();
  const fetcher = useFetcher();
  const sentinelRef = useRef<HTMLDivElement>(null);

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
      className={className || "w-full bg-gray-50 px-6 py-14 md:px-12 lg:px-28"}
    >
      <div className="mx-auto flex w-full max-w-304 flex-col gap-8">
        {showHeader && (
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[32px] font-bold leading-12 text-[#020618]">
              Available Opportunities
            </h2>
            <Link to="/volunteer/all">
              <Button
                type="button"
                variant="outline"
                className="h-9 px-4 text-sm"
              >
                View all
              </Button>
            </Link>
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
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {items.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onMutationComplete={onMutationComplete}
                />
              ))}
            </div>

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
          <div className="rounded-[14px] border border-dashed border-[#e5e7eb] bg-white px-6 py-12 text-center text-sm font-medium text-[#6b7280]">
            No opportunities are available right now.
          </div>
        )}
      </div>
    </section>
  );
}
