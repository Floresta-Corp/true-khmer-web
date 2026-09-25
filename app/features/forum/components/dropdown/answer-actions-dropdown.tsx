import { useState } from "react";
import { Check, EllipsisVertical, Flag, Pencil, Trash2 } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import AddAnswerDialog from "../dialog/add-answer-dialog";
import DeleteAnswerDialog from "../dialog/delete-answer-dialog";
import MarkBestAnswerDialog from "../dialog/mark-best-answer-dialog";
import ForumReportDialog, {
  ReportDialogType,
  type ReportReasonData,
} from "../dialog/forum-report-dialog";

type AnswerDialog = "mark-best" | "edit" | "delete" | "report";

interface AnswerActionsDropdownProps {
  answerId: string;
  answerBody: string;
  questionId?: string;
  isCurrentAuthor?: boolean;
  isAuthenticated?: boolean;
  canMarkBestAnswer?: boolean;
  reportReasons?: ReportReasonData[];
  align?: "start" | "end";
  className?: string;
}

export default function AnswerActionsDropdown({
  answerId,
  answerBody,
  questionId,
  isCurrentAuthor = false,
  isAuthenticated = false,
  canMarkBestAnswer = false,
  reportReasons = [],
  align = "end",
  className,
}: AnswerActionsDropdownProps) {
  const location = useLocation();
  const [activeDialog, setActiveDialog] = useState<AnswerDialog | null>(null);
  const loginHref = `/login?redirectTo=${encodeURIComponent(
    `${location.pathname}${location.search}`,
  )}`;

  const closeDialog = (open: boolean) => {
    if (!open) setActiveDialog(null);
  };

  const canReport = !isCurrentAuthor;

  if (!canMarkBestAnswer && !isCurrentAuthor && !canReport) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Answer actions"
            className={cn(
              "h-8 w-8 rounded-xl text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]",
              className,
            )}
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={align} className="min-w-44 p-1.5">
          {canMarkBestAnswer && (
            <DropdownMenuItem
              onSelect={() => setActiveDialog("mark-best")}
              className="gap-2 px-2.5 py-2 font-semibold text-[#00a63e] focus:bg-[#00a63e]/10 focus:text-[#00a63e]"
            >
              <Check className="size-4" />
              Mark best answer
            </DropdownMenuItem>
          )}

          {isCurrentAuthor && (
            <>
              <DropdownMenuItem
                onSelect={() => setActiveDialog("edit")}
                className="gap-2 px-2.5 py-2 text-[#2c2f31]"
              >
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setActiveDialog("delete")}
                className="gap-2 px-2.5 py-2 text-[#e7000b] focus:bg-[#e7000b]/10 focus:text-[#e7000b]"
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}

          {canReport && (canMarkBestAnswer || isCurrentAuthor) && (
            <DropdownMenuSeparator />
          )}

          {canReport &&
            (isAuthenticated ? (
              <DropdownMenuItem
                onSelect={() => setActiveDialog("report")}
                className="gap-2 px-2.5 py-2 text-[#2c2f31]"
              >
                <Flag className="size-4" />
                Report
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild className="gap-2 px-2.5 py-2">
                <Link to={loginHref} className="text-[#2c2f31]">
                  <Flag className="size-4" />
                  Report
                </Link>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {canMarkBestAnswer && (
        <MarkBestAnswerDialog
          answerId={answerId}
          open={activeDialog === "mark-best"}
          onOpenChange={closeDialog}
        />
      )}

      {isCurrentAuthor && (
        <>
          <AddAnswerDialog
            questionId={questionId}
            isEditing
            data={{ id: answerId, body: answerBody }}
            open={activeDialog === "edit"}
            onOpenChange={closeDialog}
          />
          <DeleteAnswerDialog
            answerId={answerId}
            open={activeDialog === "delete"}
            onOpenChange={closeDialog}
          />
        </>
      )}

      {canReport && isAuthenticated && (
        <ForumReportDialog
          title={answerBody}
          id={answerId}
          type={ReportDialogType.ANSWER}
          reportReasons={reportReasons}
          isAuthenticated={isAuthenticated}
          open={activeDialog === "report"}
          onOpenChange={closeDialog}
        />
      )}
    </>
  );
}
