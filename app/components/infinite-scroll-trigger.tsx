import React from "react";
import { Loader2 } from "lucide-react";

export function InfiniteScrollTrigger({
  hasMore,
  isLoading,
  onTrigger,
}: {
  hasMore: boolean;
  isLoading: boolean;
  onTrigger: () => void;
}) {
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const onTriggerRef = React.useRef(onTrigger);
  const isLoadingRef = React.useRef(isLoading);

  onTriggerRef.current = onTrigger;
  isLoadingRef.current = isLoading;

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingRef.current) {
          onTriggerRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className="flex justify-center py-6">
      {isLoading && <Loader2 className="h-5 w-5 animate-spin text-slate-400" />}
    </div>
  );
}
