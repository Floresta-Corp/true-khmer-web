import { Bookmark, EllipsisVertical, Info } from "lucide-react";
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

interface ForumDetailQuestionHeaderProps {
  questionId: string;
  authorName: string;
  authorAvatar: string;
  category: {
    id: string;
    name: string;
  };
  postedAt: string;
  title: string;
  isAuthenticated: boolean;
  reportReasons: ReportReasonData[];
}

export default function ForumDetailQuestionHeader({
  questionId,
  authorName,
  authorAvatar,
  category,
  postedAt,
  title,
  isAuthenticated,
  reportReasons,
}: ForumDetailQuestionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
        <img
          src={authorAvatar}
          alt={authorName}
          className="h-6 w-6 rounded-full object-cover"
        />
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5">
          <p className="max-w-full truncate font-semibold text-[#2c2f31]">
            {authorName}
          </p>
          <span className="text-[#abadaf]">•</span>
          <Button
            variant="link"
            className="h-auto max-w-full truncate p-0 text-sm font-semibold text-blue-600"
          >
            <Link to={`/forum?categoryId=${category.id}`}>{category.name}</Link>
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
          <DropdownMenuItem className="font-medium text-[#595c5e]">
            <Bookmark className="h-4 w-4" />
            Save
          </DropdownMenuItem>
          <ForumReportDialog
            id={questionId}
            type={ReportDialogType.QUESTION}
            title={title}
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
        <Button
          type="button"
          className="cursor-pointer group transition-colors hover:text-blue-500 bg-transparent text-[#595C5E]"
        >
          <Bookmark className="group-hover:text-blue-500 transition-colors" />
          Save
        </Button>

        <ForumReportDialog
          id={questionId}
          type={ReportDialogType.QUESTION}
          title={title}
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
