import { Suspense, useCallback } from "react";
import {
  ArrowBigUp,
  ArrowLeft,
  ExternalLink,
  Eye,
  MessageCircle,
  MessagesSquare,
  TriangleAlert,
} from "lucide-react";
import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import ContentImagePreview from "~/features/admin/components/content-image-preview";
import ModerationHoldNotice from "~/features/admin/components/moderation-hold-notice";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { cn, resolveImageURL } from "~/lib/utils";
import type { AnswerResponse, QuestionResponse } from "~/types/api-client";
import { useForumModeration } from "../../hooks/use-forum-moderation";
import type { manageForumDetailLoader } from "../../services/manage-forum-detail.loader";
import DeleteForumQuestionDialog from "../forum/delete-forum-question-dialog";
import ManageForumAnswerCard from "../forum/manage-forum-answer-card";
import { ManageForumAnswersSkeleton } from "../forum/manage-forum-detail-skeleton";
import SuspendForumPostDialog from "../forum/suspend-forum-post-dialog";

const ANSWER_SORT_OPTIONS = [
  { value: "popular", label: "Most Voted" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
] as const;

const STATUS_STYLES: Record<QuestionResponse["status"], string> = {
  PUBLISHED:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  CLOSED: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  DELETED: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
  SUSPENDED:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
};

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 px-3 first:pl-0 last:pr-0">
      <span className="text-slate-400 dark:text-slate-500">{icon}</span>
      <span className="text-sm font-semibold text-slate-900 tabular-nums dark:text-white">
        {value}
      </span>
      <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
        {label}
      </span>
    </div>
  );
}

interface AnswersSectionProps {
  answers: AnswerResponse[];
  questionAuthorId: string;
  bestAnswerId: QuestionResponse["bestAnswerId"];
  removedIds: Set<string>;
  onDelete: (answerId: string, isReply: boolean) => void;
  onSuspend: (answerId: string, reason: string, isReply: boolean) => void;
  onUnsuspend: (answerId: string, isReply: boolean) => void;
  isDeleting: boolean;
}

function AnswersSection({
  answers,
  questionAuthorId,
  bestAnswerId,
  removedIds,
  onDelete,
  onSuspend,
  onUnsuspend,
  isDeleting,
}: AnswersSectionProps) {
  const kept = answers.filter((answer) => !removedIds.has(answer.id));
  const best = bestAnswerId
    ? kept.find((answer) => answer.id === bestAnswerId)
    : undefined;
  const visibleAnswers = best
    ? [best, ...kept.filter((answer) => answer.id !== bestAnswerId)]
    : kept;

  if (visibleAnswers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <MessagesSquare size={28} className="text-slate-400" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          No answers yet
        </p>
        <p className="max-w-sm text-xs text-slate-400 dark:text-slate-500">
          Replies from the community will show up here for moderation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-6">
      {visibleAnswers.map((answer, index) => (
        <ManageForumAnswerCard
          key={answer.id}
          answer={answer}
          questionAuthorId={questionAuthorId}
          isBestAnswer={answer.id === bestAnswerId}
          index={index}
          removedIds={removedIds}
          onDelete={onDelete}
          onSuspend={onSuspend}
          onUnsuspend={onUnsuspend}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
}

function AnswersError() {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900">
      <TriangleAlert size={16} className="shrink-0 text-amber-500" />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Could not load the answers for this question. Reload to try again.
      </p>
    </div>
  );
}

export default function ManageForumDetailPage() {
  const { question, answers } = useLoaderData<typeof manageForumDetailLoader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleQuestionDeleted = useCallback(() => {
    navigate("/tk-admin/manage-forum");
  }, [navigate]);

  const {
    removedIds,
    deleteQuestion,
    deleteAnswer,
    suspendQuestion,
    unsuspendQuestion,
    suspendAnswer,
    unsuspendAnswer,
    isDeleting,
  } = useForumModeration({ onQuestionDeleted: handleQuestionDeleted });

  const activeSort =
    ANSWER_SORT_OPTIONS.find(
      (option) => option.value === searchParams.get("sortBy"),
    )?.value ?? "popular";

  const handleSortChange = useCallback(
    (value: string) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set("sortBy", value);
          return next;
        },
        { preventScrollReset: true },
      );
    },
    [setSearchParams],
  );

  const thumbnail = question.imageKey
    ? resolveImageURL(question.imageKey)
    : null;

  return (
    <div className="relative flex h-[calc(100vh-4rem)] flex-col bg-[#f8fafc] md:h-[calc(100vh-5rem)] dark:bg-slate-950">
      <div className="custom-scrollbar flex-1 overflow-auto p-6">
        <div className="mx-auto w-full max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/tk-admin/manage-forum"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to forum management
            </Link>

            <div className="flex items-center gap-2">
              <Link
                to={`/forum/detail/${question.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                <ExternalLink size={14} />
                View on site
              </Link>

              <SuspendForumPostDialog
                postId={question.id}
                postLabel={question.title}
                noun="question"
                suspended={question.status === "SUSPENDED"}
                onSuspend={suspendQuestion}
                onUnsuspend={unsuspendQuestion}
                disabled={isDeleting}
                withLabel
              />

              <DeleteForumQuestionDialog
                questionId={question.id}
                questionTitle={question.title}
                onConfirm={deleteQuestion}
                disabled={isDeleting}
                withLabel
              />
            </div>
          </div>

          {question.status === "SUSPENDED" && (
            <ModerationHoldNotice
              noun="question"
              visibility="Only its author can see it."
              reason={question.suspensionReason}
            />
          )}

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {thumbnail && (
              <ContentImagePreview
                src={thumbnail}
                title={question.title}
                className="h-44 w-full sm:h-56"
              />
            )}

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                    STATUS_STYLES[question.status],
                  )}
                >
                  {question.status}
                </span>
                <Link
                  to={`/tk-admin/manage-forum?categoryId=${question.category.id}`}
                  className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 hover:underline dark:bg-blue-500/10 dark:text-blue-400"
                >
                  {question.category.name}
                </Link>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {formatMinutesOrHoursAgo(question.createdAt)}
                </span>
              </div>

              <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                {question.title}
              </h1>

              <p className="mt-3 text-sm leading-6.5 whitespace-pre-line text-slate-600 dark:text-slate-300">
                {question.body}
              </p>

              {question.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {question.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar className="size-9 shrink-0 border border-slate-100 dark:border-slate-800">
                    <AvatarImage
                      src={resolveImageURL(question.author.avatarKey)}
                      alt={question.author.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs">
                      {question.author.name.trim().charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {question.author.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Asked this question
                    </p>
                  </div>
                </div>

                <div className="flex items-center divide-x divide-slate-200 dark:divide-slate-800">
                  <Stat
                    icon={<ArrowBigUp size={16} />}
                    value={question.score}
                    label="Score"
                  />
                  <Stat
                    icon={<MessageCircle size={15} />}
                    value={question.answerCount}
                    label="Answers"
                  />
                  <Stat
                    icon={<Eye size={15} />}
                    value={question.viewCount}
                    label="Views"
                  />
                </div>
              </div>
            </div>
          </article>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {question.answerCount} answer
              {question.answerCount === 1 ? "" : "s"}
            </h2>

            {question.answerCount > 0 && (
              <Select value={activeSort} onValueChange={handleSortChange}>
                <SelectTrigger
                  aria-label="Sort answers"
                  className="h-10 w-44 cursor-pointer rounded-lg border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {ANSWER_SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Suspense
            key={activeSort}
            fallback={
              <ManageForumAnswersSkeleton
                answers={Math.min(question.answerCount || 1, 3)}
              />
            }
          >
            <Await resolve={answers} errorElement={<AnswersError />}>
              {(resolvedAnswers) => (
                <AnswersSection
                  answers={resolvedAnswers}
                  questionAuthorId={question.author.id}
                  bestAnswerId={question.bestAnswerId}
                  removedIds={removedIds}
                  onDelete={deleteAnswer}
                  onSuspend={suspendAnswer}
                  onUnsuspend={unsuspendAnswer}
                  isDeleting={isDeleting}
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
