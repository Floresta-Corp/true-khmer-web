import { useRef } from "react";
import { Bookmark, EllipsisVertical, Info } from "lucide-react";
import { useFetcher, useLocation } from "react-router";
import { toast } from "sonner";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import ForumReportDialog, {
  ReportDialogType,
  type ReportReasonData,
} from "./dialog/forum-report-dialog";
import { Link } from "react-router";
import type { QuestionResponse } from "~/types/api-client";
import { resolveImageURL } from "~/lib/utils";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { Spinner } from "~/components/ui/spinner";
import ProfileLinkWrapper from "~/components/profile-link-wrapper";

interface ForumDetailQuestionHeaderProps {
  question: QuestionResponse;
  isAuthenticated: boolean;
  reportReasons: ReportReasonData[];
  userId?: string;
}

export default function ForumDetailQuestionHeader({
  question,
  isAuthenticated,
  reportReasons,
  userId,
}: ForumDetailQuestionHeaderProps) {
  const location = useLocation();
  const fetcher = useFetcher();
  const submittedIntent = useRef<string | null>(null);
  const isSubmitting = fetcher.state !== "idle";

  useFetcherOutcome(fetcher, {
    onSuccess: () => {
      const isSaved = submittedIntent.current === "save-question";
      toast.success(isSaved ? "Question saved" : "Question unsaved");
      submittedIntent.current = null;
    },
    onError: (message) => toast.error(message ?? "Failed to save question."),
  });

  if (!question) return null;

  const redirectTo = `${location.pathname}${location.search}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

  const handleSave = () => {
    const actionType = question.viewerSave
      ? "unsave-question"
      : "save-question";
    submittedIntent.current = actionType;
    fetcher.submit({ actionType, questionId: question.id }, { method: "post" });
    return actionType;
  };

  const authorProfile = resolveImageURL(question.author.avatarKey);
  const postedAt = formatMinutesOrHoursAgo(question.createdAt);

  return (
    <div className="flex flex-wrap items-start justify-between gap-3 sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        {authorProfile ? (
          <img
            src={authorProfile}
            alt={question.author.name}
            className="h-6 w-6 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-semibold text-slate-500">
            {question.author.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5">
          <ProfileLinkWrapper
            authorId={question.author.id}
            isAuthor={userId === question.author.id ? true : false}
            className="max-w-full truncate font-semibold text-[#2c2f31]"
          >
            {question.author.name}
          </ProfileLinkWrapper>
          <span className="text-[#abadaf]">•</span>
          <Button
            variant="link"
            className="h-auto max-w-full truncate p-0 text-sm font-semibold text-blue-600"
          >
            <Link to={`/forum?categoryId=${question.category.id}`}>
              {question.category.name}
            </Link>
          </Button>
          <span className="text-[#abadaf]">•</span>
          <p className="text-[#595c5e]">{postedAt}</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-[#595c5e] md:hidden"
          >
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36">
          {!isAuthenticated ? (
            <DropdownMenuItem asChild>
              <Link
                to={loginHref}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm font-medium text-[#595c5e] cursor-pointer"
              >
                <Bookmark className="h-4 w-4" />
                Save
              </Link>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className={`font-medium text-[#595c5e] ${question.viewerSave ? "text-blue-500" : ""}`}
              onSelect={(e) => {
                e.preventDefault();
                handleSave();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Spinner className="size-3.5" />
              ) : (
                <Bookmark
                  className={`h-4 w-4 ${question.viewerSave ? "fill-blue-500" : ""}`}
                />
              )}
              {isSubmitting
                ? "Saving..."
                : question.viewerSave
                  ? "Unsave"
                  : "Save"}
            </DropdownMenuItem>
          )}
          <ForumReportDialog
            id={question.id}
            type={ReportDialogType.QUESTION}
            title={question.title}
            isAuthenticated={isAuthenticated}
            reportReasons={reportReasons}
            trigger={
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm font-medium text-[#595c5e] transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Info className="h-4 w-4" />
                Report
              </button>
            }
          />
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="hidden items-center text-sm font-semibold text-[#9eacc0] md:flex">
        {!isAuthenticated ? (
          <Link to={loginHref}>
            <Button
              className="cursor-pointer group transition-colors hover:text-blue-500 bg-transparent text-[#595C5E]"
              disabled={isSubmitting}
            >
              <Bookmark className="group-hover:text-blue-500 transition-colors" />
              Save
            </Button>
          </Link>
        ) : (
          <Button
            type="button"
            className={`cursor-pointer group transition-colors hover:text-blue-500 bg-transparent text-[#595C5E] ${question.viewerSave ? "text-blue-500" : ""}`}
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner className="size-3.5" />
            ) : (
              <Bookmark
                className={`group-hover:text-blue-500 transition-colors ${question.viewerSave ? "fill-blue-500" : ""}`}
              />
            )}

            {question.viewerSave ? "Saved" : "Save"}
          </Button>
        )}

        <ForumReportDialog
          id={question.id}
          type={ReportDialogType.QUESTION}
          title={question.title}
          isAuthenticated={isAuthenticated}
          reportReasons={reportReasons}
          trigger={
            <Button
              type="button"
              className="cursor-pointer group transition-colors hover:text-red-500 bg-transparent text-[#595C5E]"
            >
              <Info className="group-hover:text-red-500 transition-colors" />
              Report
            </Button>
          }
        />
      </div>
    </div>
  );
}
