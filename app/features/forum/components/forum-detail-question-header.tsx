import { Bookmark, Info } from "lucide-react";
import { Button } from "~/components/ui/button";
import ForumReportDialog, {
  ReportDialogType,
  type ReportReasonData,
} from "./dialog/forum-report-dialog";

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
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={authorAvatar}
          alt={authorName}
          className="h-6 w-6 rounded-full object-cover"
        />
        <div className="flex min-w-0 items-center gap-2 text-sm leading-5">
          <p className="truncate font-semibold text-[#2c2f31]">{authorName}</p>
          <span className="text-[#abadaf]">•</span>
          <Button variant="link" className="truncate text-blue-600">
            {category.name}
          </Button>
          <p className="truncate text-[#595c5e]">• {postedAt}</p>
        </div>
      </div>

      <div className="flex items-center text-sm font-semibold text-[#9eacc0]">
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
