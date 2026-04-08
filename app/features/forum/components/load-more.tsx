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
    <div ref={observerTarget} className="w-full mt-8">
      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={isLoading}
        className="w-full h-11 border-[#c8d6e5] text-[#1d283a] text-sm font-medium rounded-lg hover:bg-slate-300 hover:text-[#1d283a] transition-colors disabled:opacity-50 flex items-center justify-center bg-transparent shadow-none"
      >
        {isLoading ? "Loading..." : "Load more discussions"}
      </Button>
    </div>
  );
}
