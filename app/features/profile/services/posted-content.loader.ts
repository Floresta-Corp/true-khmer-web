import React from "react";
import { useFetcher } from "react-router";
import type { loader } from "../routes/profile.$id";
import type { GetPostedContentResponse } from "~/services/profile/types";

export type SourceType = "forum" | "volunteer" | "project";

type ForumItems = Extract<
  GetPostedContentResponse,
  { sourceType: "forum" }
>["questions"];
type VolunteerItems = Extract<
  GetPostedContentResponse,
  { sourceType: "volunteer" }
>["opportunities"];
type ProjectItems = Extract<
  GetPostedContentResponse,
  { sourceType: "project" }
>["launchpads"];

export interface Accumulated {
  sourceType: SourceType | null;
  questions: ForumItems;
  opportunities: VolunteerItems;
  launchpads: ProjectItems;
  nextCursor: string | null;
  hasMore: boolean;
}

const emptyAccumulated: Accumulated = {
  sourceType: null,
  questions: [],
  opportunities: [],
  launchpads: [],
  nextCursor: null,
  hasMore: false,
};

export function usePostedContent(profileId: string | undefined) {
  const postedFetcher = useFetcher<typeof loader>();
  const isLoadMoreRef = React.useRef(false);
  const [accumulated, setAccumulated] =
    React.useState<Accumulated>(emptyAccumulated);

  React.useEffect(() => {
    if (postedFetcher.data?.kind !== "posted") return;
    const raw = postedFetcher.data.postedContent;
    const isLoadMore = isLoadMoreRef.current;
    isLoadMoreRef.current = false;

    if (raw.sourceType === "forum") {
      const d = raw as Extract<
        GetPostedContentResponse,
        { sourceType: "forum" }
      >;
      setAccumulated((prev) => ({
        sourceType: "forum" as const,
        nextCursor: d.pagination.nextCursor,
        hasMore: d.pagination.hasMore,
        questions: isLoadMore
          ? [...prev.questions, ...d.questions]
          : d.questions,
        opportunities: [],
        launchpads: [],
      }));
    } else if (raw.sourceType === "volunteer") {
      const d = raw as Extract<
        GetPostedContentResponse,
        { sourceType: "volunteer" }
      >;
      setAccumulated((prev) => ({
        sourceType: "volunteer" as const,
        nextCursor: d.pagination.nextCursor,
        hasMore: d.pagination.hasMore,
        questions: [],
        opportunities: isLoadMore
          ? [...prev.opportunities, ...d.opportunities]
          : d.opportunities,
        launchpads: [],
      }));
    } else {
      const d = raw as Extract<
        GetPostedContentResponse,
        { sourceType: "project" }
      >;
      setAccumulated((prev) => ({
        sourceType: "project" as const,
        nextCursor: d.nextCursor,
        hasMore: d.nextCursor !== null,
        questions: [],
        opportunities: [],
        launchpads: isLoadMore
          ? [...prev.launchpads, ...d.launchpads]
          : d.launchpads,
      }));
    }
  }, [postedFetcher.data]);

  const isLoading = postedFetcher.state === "loading";
  const isTabLoading = isLoading && !isLoadMoreRef.current;
  const isLoadingMore = isLoading && isLoadMoreRef.current;

  const handleTabChange = (value: string) => {
    isLoadMoreRef.current = false;
    if (value !== "about" && profileId) {
      postedFetcher.load(`/profile/${profileId}?sourceType=${value}`);
    }
  };

  const handleLoadMore = (sourceType: SourceType) => {
    if (!accumulated.nextCursor || !profileId) return;
    if (postedFetcher.state === "loading") return;
    isLoadMoreRef.current = true;
    postedFetcher.load(
      `/profile/${profileId}?sourceType=${sourceType}&cursor=${accumulated.nextCursor}`,
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
