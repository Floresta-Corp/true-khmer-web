import { Heart } from "lucide-react";
import { Link, useFetcher, useLocation } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";
import { cn } from "~/lib/utils";
import { BLOG_LIKE_ACTIONS } from "../types";

interface BlogLikeButtonProps {
  postId: string;
  likeCount: number;
  viewerLiked: boolean;
  isAuthenticated: boolean;
}

const BUTTON_CLASS =
  "group h-8.75 min-w-8.75 cursor-pointer gap-1.5 rounded-[16px] border-0 bg-[#f8fafb] px-3 text-[13px] font-semibold text-[#9eacc0] hover:bg-[#fff1f2] hover:text-rose-500";

export default function BlogLikeButton({
  postId,
  likeCount,
  viewerLiked,
  isAuthenticated,
}: BlogLikeButtonProps) {
  const location = useLocation();
  const fetcher = useFetcher();

  useFetcherOutcome(fetcher, {
    onError: (message) => toast.error(message ?? "Could not update your like."),
  });

  // Show the click immediately; the loader revalidates with the real count.
  const pendingAction = fetcher.formData?.get("actionType");
  const liked = pendingAction
    ? pendingAction === BLOG_LIKE_ACTIONS.like
    : viewerLiked;
  const count = Math.max(0, likeCount + Number(liked) - Number(viewerLiked));
  const label = liked ? "Unlike post" : "Like post";

  const content = (
    <>
      <Heart
        className={cn(
          "size-5 transition-colors md:size-4",
          liked && "fill-rose-500 text-rose-500",
        )}
      />
      {count > 0 ? <span className="tabular-nums">{count}</span> : null}
    </>
  );

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}`;
    return (
      <Button asChild variant="ghost" className={BUTTON_CLASS}>
        <Link
          to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
          aria-label="Sign in to like this post"
        >
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={fetcher.state !== "idle"}
      aria-pressed={liked}
      aria-label={label}
      title={label}
      onClick={() =>
        fetcher.submit(
          {
            actionType: liked
              ? BLOG_LIKE_ACTIONS.unlike
              : BLOG_LIKE_ACTIONS.like,
            postId,
          },
          { method: "post" },
        )
      }
      // Keep full opacity while pending so the optimistic state doesn't dim.
      className={cn(
        BUTTON_CLASS,
        "disabled:opacity-100",
        liked && "text-rose-500",
      )}
    >
      {content}
    </Button>
  );
}
