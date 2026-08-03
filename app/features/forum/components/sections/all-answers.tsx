import { motion } from "motion/react";
import AnswerNewCard from "../card/answer-new-card";
import type { AnswerResponse } from "~/types/api-client";
import type { loader } from "../../route/forum.$id";
import { useLoaderData, useFetcher, useLocation } from "react-router";
import { useEffect, useState } from "react";
import SortDropdown from "~/components/ui/sort-dropdown";
import AnswerCardSkeleton from "../card/answer-card-skeleton";

interface AllAnswersProps {
  answers: AnswerResponse[];
}

type SortValue = "popular" | "newest" | "oldest";

const SORT_OPTIONS = [
  { label: "Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
];

export default function AllAnswers({ answers }: AllAnswersProps) {
  const { userId, reportReasons, question } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const location = useLocation();
  const isLoading = fetcher.state === "loading";

  const answersKey = (fetcher.data?.answers ?? answers)
    .map(
      (a: AnswerResponse) =>
        a.id + (a.repliedAnswers?.map((r) => r.id).join(",") ?? ""),
    )
    .join("|");

  // derive initial sort from query string (use `sortBy`)
  const search = new URLSearchParams(location.search);
  const initialSort = (search.get("sortBy") as SortValue) || "popular";
  const [selectedSort, setSelectedSort] = useState<SortValue>(initialSort);

  const handleSortChange = (value: SortValue) => {
    setSelectedSort(value);
    // preserve other query params
    const params = new URLSearchParams(location.search);
    params.set("sortBy", value);
    const query = params.toString();
    const path = `${location.pathname}${query ? `?${query}` : ""}${location.hash ?? ""}`;

    // update browser URL (adds a history entry) without navigating
    if (typeof window !== "undefined") {
      try {
        window.history.pushState({}, "", path);
      } catch (_) {
        /* ignore */
      }
    }

    // trigger route loader reload via fetcher (this will call the forum detail loader)
    fetcher.load(path);
  };

  // sync selected sort when URL changes (back/forward, direct nav)
  useEffect(() => {
    const p = new URLSearchParams(location.search).get(
      "sortBy",
    ) as SortValue | null;
    setSelectedSort(p ?? "popular");
  }, [location.search]);

  const displayedAnswers: AnswerResponse[] = fetcher.data?.answers ?? answers;
  const skeletonCount = Math.max(
    displayedAnswers.length || answers.length || 3,
    3,
  );

  return (
    <motion.section
      className="mt-5 flex flex-col gap-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Heading */}
      <div className="flex items-center justify-between">
        <h3 className="flex gap-3 text-lg font-bold text-gray-900 md:text-xl dark:text-white">
          All Answers{" "}
          <p className="text-slate-400">({displayedAnswers.length})</p>
        </h3>
        <div className="flex items-center gap-3">
          <p className="text-sm leading-5 font-semibold text-[#595c5e]">
            Sort by:
          </p>

          <SortDropdown
            value={selectedSort}
            onChange={(v) => handleSortChange(v as SortValue)}
            options={SORT_OPTIONS}
            className="inline-flex items-center bg-transparent text-base leading-6 font-semibold text-[#0050d4]"
          />
        </div>
      </div>

      {/* Answer list */}
      <div className="flex flex-col gap-6" key={answersKey}>
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <AnswerCardSkeleton key={`answer-skeleton-${index}`} />
            ))
          : displayedAnswers.map((answer, i) => {
              const isCurrentAuthor =
                userId === answer.author.id ? true : false;
              return (
                <AnswerNewCard
                  userId={userId}
                  key={answer.id}
                  answer={answer}
                  index={i}
                  isCurrentAuthor={isCurrentAuthor}
                  isAuthenticated={Boolean(userId)}
                  isQuestionAuthor={userId === question?.author.id}
                  questionAuthorId={question?.author.id ?? null}
                  reportReasons={
                    reportReasons?.reportingTypes.map((v) => ({
                      id: v.id,
                      reason: v.type,
                    })) ?? []
                  }
                />
              );
            })}
      </div>
    </motion.section>
  );
}
