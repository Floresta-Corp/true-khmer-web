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
) {
  const postedFetcher = useFetcher<typeof loader>();
  const isLoadMoreRef = React.useRef(false);
  const [accumulated, setAccumulated] = React.useState<Accumulated>(
    () => initialPosted ?? emptyAccumulated,
  );

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
