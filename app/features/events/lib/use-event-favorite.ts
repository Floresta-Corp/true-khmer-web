import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

type FavoriteActionData =
  | { ok: true; saved: boolean }
  | { ok: false; error: string };

/**
 * Keeps the provider flag as the settled truth while reflecting the submitted
 * intent immediately. Revalidation replaces the optimistic value afterward;
 * a failed mutation therefore rolls back naturally.
 */
export function useEventFavorite(slug: string, isFavorite: boolean) {
  const fetcher = useFetcher<FavoriteActionData>();
  const pendingIntent =
    fetcher.state !== "idle" ? fetcher.formData?.get("intent") : null;
  const optimisticIsFavorite =
    pendingIntent === "save"
      ? true
      : pendingIntent === "unsave"
        ? false
        : isFavorite;

  useEffect(() => {
    if (fetcher.data?.ok === false) {
      toast.error(fetcher.data.error || "Could not update the saved event.");
    }
  }, [fetcher.data]);

  const toggleFavorite = () => {
    if (fetcher.state !== "idle") return;

    fetcher.submit(
      {
        intent: optimisticIsFavorite ? "unsave" : "save",
        slug,
      },
      { method: "post", action: "/api/saved-events" },
    );
  };

  return {
    isFavorite: optimisticIsFavorite,
    isPending: fetcher.state !== "idle",
    toggleFavorite,
  };
}
