import React from "react";
import { useFetcher } from "react-router";
import type { loader } from "../route/profile.$id";
import type { NormalizedPosted } from "../services/profile.loader";

export type { NormalizedPosted };
export type SourceType = "forum" | "volunteer" | "project";

export type Accumulated =
  | NormalizedPosted
  | {
      sourceType: null;
      questions: [];
      opportunities: [];
      launchpads: [];
      nextCursor: null;
      hasMore: false;
    };

const emptyAccumulated: Extract<Accumulated, { sourceType: null }> = {
  sourceType: null,
  questions: [],
  opportunities: [],
  launchpads: [],
  nextCursor: null,
  hasMore: false,
};

export function usePostedContent(
  profileId: string | undefined,
  initialPosted?: NormalizedPosted,
  /** Changes whenever the route loader re-runs (pass the loader data). */
  revision?: unknown,
) {
  const postedFetcher = useFetcher<typeof loader>();
  const isLoadMoreRef = React.useRef(false);
  const activeTabRef = React.useRef<SourceType | null>(
    initialPosted?.sourceType ?? null,
  );
  const [accumulated, setAccumulated] = React.useState<Accumulated>(
    () => initialPosted ?? emptyAccumulated,
  );

  // A fresh loader run (navigation, revalidation, another profile) replaces
  // whatever was accumulated; otherwise the list would keep showing posts the
  // owner may have hidden since.
  React.useEffect(() => {
    isLoadMoreRef.current = false;
    setAccumulated(initialPosted ?? emptyAccumulated);

    // A tab opened by clicking (not from the URL) isn't part of the loader
    // data, so fetch it again too.
    const active = activeTabRef.current;
    if (profileId && active && active !== initialPosted?.sourceType) {
      postedFetcher.load(
        `/profile/${profileId}?sourceType=${active}&_intent=client`,
      );
    }
    // Re-run only on new loader data, not on every fetcher state change.
  }, [profileId, initialPosted, revision]);

  React.useEffect(() => {
    if (postedFetcher.data?.kind !== "posted") return;
    const posted = postedFetcher.data.posted;
    const isLoadMore = isLoadMoreRef.current;
    isLoadMoreRef.current = false;

    setAccumulated((prev) => ({
      ...posted,

      questions: isLoadMore
        ? [...prev.questions, ...posted.questions]
        : posted.questions,
      opportunities: isLoadMore
        ? [...prev.opportunities, ...posted.opportunities]
        : posted.opportunities,
      launchpads: isLoadMore
        ? [...prev.launchpads, ...posted.launchpads]
        : posted.launchpads,
    }));
  }, [postedFetcher.data]);

  const isLoading = postedFetcher.state === "loading";
  const isTabLoading = isLoading && !isLoadMoreRef.current;
  const isLoadingMore = isLoading && isLoadMoreRef.current;

  const handleTabChange = (value: string) => {
    isLoadMoreRef.current = false;
    activeTabRef.current = value === "about" ? null : (value as SourceType);
    if (value !== "about" && profileId) {
      postedFetcher.load(
        `/profile/${profileId}?sourceType=${value}&_intent=client`,
      );
    }
  };

  const handleLoadMore = (sourceType: SourceType) => {
    if (!accumulated.nextCursor || !profileId) return;
    if (postedFetcher.state === "loading") return;
    isLoadMoreRef.current = true;
    postedFetcher.load(
      `/profile/${profileId}?sourceType=${sourceType}&cursor=${accumulated.nextCursor}&_intent=client`,
    );
  };

  return {
    accumulated,
    isTabLoading,
    isLoadingMore,
    handleTabChange,
    handleLoadMore,
  };
}
