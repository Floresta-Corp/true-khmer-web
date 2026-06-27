import { useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircleQuestion, Search, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { loader } from "../../route/workspace";
import type { MyWorkSpaceLoaderData } from "~/features/workspace/types";
import WorkspaceSkeleton from "../workspace-skeleton";
import WorkspaceQuestionItem from "../card/workspace-question-card";
import WorkspaceAnswerList from "../list/workspace-answer-list";
import WorkspaceTabs from "../work-space-tab";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  DEFAULT_QUESTION_SORT,
  QUESTION_SORT_OPTIONS,
  parseQuestionSort,
  sortQuestions,
} from "../../workspace-filters";

type TabType = "questions" | "answers";

const ANSWER_SORT_OPTIONS = [
  { value: "lastActivity", label: "Latest Activity" },
  { value: "mostReplies", label: "Most Replies" },
  { value: "category", label: "Category" },
] as const;

function EmptyWorkspaceState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <Icon className="mx-auto mb-4 size-10 text-slate-300" />
      <p className="text-base font-semibold text-slate-700">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export default function WorkSpacePage() {
  const { categories, answers, questions } = useLoaderData<
    typeof loader
  >() as MyWorkSpaceLoaderData;
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTab = searchParams.get("tab");
  const activeTab: TabType =
    rawTab === "questions" || rawTab === "answers" ? rawTab : "questions";

  const currentSearch = searchParams.get("search") ?? "";
  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentCategory = searchParams.get("category") ?? "";

  const [inputValue, setInputValue] = useState(currentSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync input when search param changes externally (e.g. tab switch clears it)
  useEffect(() => {
    setInputValue(currentSearch);
  }, [currentSearch]);

  const updateParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value) next.set(key, value);
          else next.delete(key);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParam("search", value.trim());
    }, 400);
  };

  const questionSort = parseQuestionSort(currentSortBy);

  const handleQuestionSortChange = (value: string) => {
    const sort = parseQuestionSort(value);
    updateParam("sortBy", sort === DEFAULT_QUESTION_SORT ? "" : sort);
  };

  const handleSortOrCategoryChange = (value: string) => {
    const isSort = ANSWER_SORT_OPTIONS.some((o) => o.value === value);
    if (isSort) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === "lastActivity") next.delete("sortBy");
          else next.set("sortBy", value);
          next.delete("category");
          return next;
        },
        { replace: true },
      );
    } else {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("sortBy");
          if (value === "all") next.delete("category");
          else next.set("category", value);
          return next;
        },
        { replace: true },
      );
    }
  };

  const clearFilters = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("search");
        next.delete("sortBy");
        next.delete("category");
        return next;
      },
      { replace: true },
    );
    setInputValue("");
  };

  const hasActiveFilters =
    !!currentSearch || !!currentSortBy || !!currentCategory;

  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";

  // Client-side search + sort for questions
  const myQuestions = questions.questions;
  const filteredQuestions = sortQuestions(
    currentSearch
      ? myQuestions.filter(
          (q) =>
            q.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
            q.body.toLowerCase().includes(currentSearch.toLowerCase()),
        )
      : myQuestions,
    questionSort,
  );

  return (
    <WorkSpacePageLayout
      title="My Discussions"
      subtitle="Track your community engagement and shared knowledge."
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        <WorkspaceTabs
          questionCount={myQuestions.length}
          answerCount={answers.totalAnswers}
        />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center justify-between">
          <motion.div
            className="relative min-w-0"
            initial={false}
            animate={{ width: "50%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <Input
              value={inputValue}
              onChange={handleSearchChange}
              placeholder={
                activeTab === "questions"
                  ? "Search your questions..."
                  : "Search your answers..."
              }
              className="pl-9 bg-white border-slate-200 text-sm placeholder:text-slate-400 h-10 rounded-xl"
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === "questions" && (
              <motion.div
                key="questions-sort"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex items-center gap-2 shrink-0"
              >
                <span className="text-xs font-bold text-[#5F6368] dark:text-slate-400">
                  Sort by:
                </span>
                <Select
                  value={questionSort}
                  onValueChange={handleQuestionSortChange}
                >
                  <SelectTrigger className="h-10 w-44 rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-none focus:ring-1 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === "answers" && (
              <motion.div
                key="answers-sort"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex items-center gap-2 shrink-0"
              >
                <span className="text-xs font-bold text-[#5F6368] dark:text-slate-400">
                  Sort by:
                </span>
                <Select
                  value={currentCategory || currentSortBy || "lastActivity"}
                  onValueChange={handleSortOrCategoryChange}
                >
                  <SelectTrigger className="h-10 w-44 rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-none focus:ring-1 focus:ring-blue-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANSWER_SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active filter summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            {activeTab === "questions" && currentSearch && (
              <span>
                {filteredQuestions.length} result
                {filteredQuestions.length !== 1 ? "s" : ""}
              </span>
            )}
            {currentSearch && (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">
                &ldquo;{currentSearch}&rdquo;
              </span>
            )}
            {activeTab === "answers" &&
              currentCategory &&
              categories.find((c) => c.id === currentCategory) && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium border border-slate-200">
                  {categories.find((c) => c.id === currentCategory)?.name}
                </span>
              )}
            <button
              onClick={clearFilters}
              className="ml-auto text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {isLoading ? (
            <WorkspaceSkeleton />
          ) : activeTab === "questions" ? (
            filteredQuestions.length > 0 ? (
              filteredQuestions.map((question, index) => (
                <WorkspaceQuestionItem
                  key={question.id}
                  question={question}
                  index={index}
                  categories={categories}
                />
              ))
            ) : (
              <EmptyWorkspaceState
                icon={MessageCircleQuestion}
                title={
                  currentSearch
                    ? "No questions match your search."
                    : "No questions posted yet."
                }
                description={
                  currentSearch
                    ? "Try a different search term."
                    : "Questions you start in the forum will appear here."
                }
              />
            )
          ) : (answers?.discussions?.length ?? 0) > 0 ? (
            <WorkspaceAnswerList answers={answers} />
          ) : (
            <EmptyWorkspaceState
              icon={Search}
              title={
                hasActiveFilters
                  ? "No answers match your filters."
                  : "No answers posted yet."
              }
              description={
                hasActiveFilters
                  ? "Try a different search or filter."
                  : "Answers you share with the community will appear here."
              }
            />
          )}
        </div>
      </div>
    </WorkSpacePageLayout>
  );
}
