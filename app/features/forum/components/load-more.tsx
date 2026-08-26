import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";

interface LoadMoreProps {
  onLoadMore?: () => void;
  isLoading?: boolean;
}

export default function LoadMore({ onLoadMore, isLoading }: LoadMoreProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && onLoadMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 1.0 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, isLoading]);

  return (
    <div ref={observerTarget} className="mt-8 w-full">
      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={isLoading}
        className="flex h-11 w-full items-center justify-center rounded-lg border-[#c8d6e5] bg-transparent text-sm font-medium text-[#1d283a] shadow-none transition-colors hover:bg-slate-300 hover:text-[#1d283a] disabled:opacity-50"
      >
        {isLoading ? "Loading..." : "Load more discussions"}
      </Button>
    </div>
  );
}
