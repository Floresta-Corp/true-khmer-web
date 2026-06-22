import { useEffect, useState } from "react";
import { useLoaderData, useNavigation, useSearchParams } from "react-router";
import type { loader } from "../../routes/workspace";
import type { MyWorkSpaceLoaderData } from "~/routes/api/workspace/work-space-loader";
import WorkspaceSkeleton from "../workspace-skeleton";
import WorkspaceQuestionItem from "../card/workspace-question-card";
import WorkspaceAnswerItem from "../card/workspace-my-answer-card";
import WorkspaceTabs from "../work-space-tab";
import WorkSpacePageLayout from "~/layout/workspace-page-layout";
import { ChevronDown, MessageCircleQuestion, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type TabType = "questions" | "answers";
type MyQuestionSortBy = "newest" | "mostVoted" | "mostAnswered" | "byCategory";

const SORT_OPTIONS: Array<{ label: string; value: MyQuestionSortBy }> = [
  { label: "Latest", value: "newest" },
  { label: "Most Liked", value: "mostVoted" },
  { label: "Most Replies", value: "mostAnswered" },
  { label: "Category", value: "byCategory" },
];

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
  const { categories, answers, questions } =
    useLoaderData<typeof loader>() as MyWorkSpaceLoaderData;
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawTab = searchParams.get("tab");
  const activeTab: TabType =
    rawTab === "questions" || rawTab === "answers" ? rawTab : "questions";

  const currentSearch = searchParams.get("search") || "";
  const currentSortBy =
    (searchParams.get("sortBy") as MyQuestionSortBy) || "newest";
  const [searchInput, setSearchInput] = useState(currentSearch);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (searchInput.trim()) {
          next.set("search", searchInput.trim());
        } else {
          next.delete("search");
        }
        next.delete("cursor");
        return next;
      },
      { replace: true },
    );
  };

  const handleSortByChange = (value: MyQuestionSortBy) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("sortBy", value);
        next.delete("cursor");
        return next;
      },
      { replace: true },
    );
  };

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === currentSortBy)?.label ?? "Latest";

  return (
    <WorkSpacePageLayout
      title="My Discussions"
      subtitle="Track your community engagement and shared knowledge."
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        <WorkspaceTabs
          questionCount={questions.length}
          answerCount={answers.length}
        />

        {activeTab === "questions" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search in your questions..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </form>

            <div className="flex shrink-0 items-center gap-2">
              <span className="text-sm font-medium text-slate-500">
                Sort by:
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300"
                  >
                    {currentSortLabel}
                    <ChevronDown className="size-3.5 text-slate-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-35">
                  {SORT_OPTIONS.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => handleSortByChange(option.value)}
                      className={
                        currentSortBy === option.value
                          ? "bg-blue-50 font-semibold text-blue-600"
                          : ""
                      }
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:gap-3">
          {isLoading ? (
            <WorkspaceSkeleton />
          ) : activeTab === "questions" ? (
            questions.length > 0 ? (
              questions.map((question, index) => (
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
                title="No questions posted yet."
                description="Questions you start in the forum will appear here."
              />
            )
          ) : answers.length > 0 ? (
            answers.map((answer, index) => (
              <WorkspaceAnswerItem
                key={answer.id}
                answer={answer}
                index={index}
              />
            ))
          ) : (
            <EmptyWorkspaceState
              icon={Search}
              title="No answers posted yet."
              description="Answers you share with the community will appear here."
            />
          )}
        </div>
      </div>
    </WorkSpacePageLayout>
  );
}
