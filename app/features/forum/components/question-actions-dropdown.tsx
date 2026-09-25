import { useState } from "react";
import { EllipsisVertical, Flag, Link2, SquarePen, Trash2 } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { buildAbsoluteUrl, copyToClipboard } from "~/lib/clipboard";
import { cn } from "~/lib/utils";
import type { QuestionResponse } from "~/types/api-client";
import type { CategoriesPicker } from "~/features/forum/types";
import AskQuestionDialog from "./dialog/ask-question-dialog";
import DeleteQuestionDialog from "./dialog/delete-question-dialog";
import ForumReportDialog, {
  ReportDialogType,
  type ReportReasonData,
} from "./dialog/forum-report-dialog";

type QuestionDialog = "edit" | "delete" | "report";

const ITEM_CLASS = "gap-2.5 px-2.5 py-2 font-medium text-[#2c2f31]";
const DESTRUCTIVE_ITEM_CLASS =
  "gap-2.5 px-2.5 py-2 font-medium text-[#e7000b] focus:bg-[#e7000b]/10 focus:text-[#e7000b]";

interface QuestionActionsDropdownProps {
  question: QuestionResponse;
  categories?: CategoriesPicker[];
  isCurrentAuthor?: boolean;
  isAuthenticated?: boolean;
  reportReasons?: ReportReasonData[];
  align?: "start" | "end";
  triggerClassName?: string;
}

export default function QuestionActionsDropdown({
  question,
  categories = [],
  isCurrentAuthor = false,
  isAuthenticated = false,
  reportReasons = [],
  align = "end",
  triggerClassName,
}: QuestionActionsDropdownProps) {
  const location = useLocation();
  const [activeDialog, setActiveDialog] = useState<QuestionDialog | null>(null);
  const loginHref = `/login?redirectTo=${encodeURIComponent(
    `${location.pathname}${location.search}`,
  )}`;

  const closeDialog = (open: boolean) => {
    if (!open) setActiveDialog(null);
  };

  const handleCopyLink = () =>
    copyToClipboard(buildAbsoluteUrl(`/forum/detail/${question.id}`));

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Question actions"
            className={cn(
              "h-8 w-8 rounded-xl text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]",
              triggerClassName,
            )}
          >
            <EllipsisVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align={align} className="min-w-44 p-1.5">
          {isCurrentAuthor && (
            <DropdownMenuItem
              onSelect={() => setActiveDialog("edit")}
              className={ITEM_CLASS}
            >
              <SquarePen className="size-4" />
              Edit post
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onSelect={() => void handleCopyLink()}
            className={ITEM_CLASS}
          >
            <Link2 className="size-4" />
            Copy link
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {isCurrentAuthor ? (
            <DropdownMenuItem
              onSelect={() => setActiveDialog("delete")}
              className={DESTRUCTIVE_ITEM_CLASS}
            >
              <Trash2 className="size-4" />
              Delete post
            </DropdownMenuItem>
          ) : isAuthenticated ? (
            <DropdownMenuItem
              onSelect={() => setActiveDialog("report")}
              className={DESTRUCTIVE_ITEM_CLASS}
            >
              <Flag className="size-4" />
              Report post
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem asChild className={DESTRUCTIVE_ITEM_CLASS}>
              <Link to={loginHref}>
                <Flag className="size-4" />
                Report post
              </Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {isCurrentAuthor && (
        <>
          <AskQuestionDialog
            categories={categories.filter(
              (category) => category.id !== "all-categories",
            )}
            isEditing
            data={question}
            open={activeDialog === "edit"}
            onOpenChange={closeDialog}
          />
          <DeleteQuestionDialog
            questionId={question.id}
            open={activeDialog === "delete"}
            onOpenChange={closeDialog}
          />
        </>
      )}

      {!isCurrentAuthor && isAuthenticated && (
        <ForumReportDialog
          title={question.title}
          id={question.id}
          type={ReportDialogType.QUESTION}
          reportReasons={reportReasons}
          isAuthenticated={isAuthenticated}
          open={activeDialog === "report"}
          onOpenChange={closeDialog}
        />
      )}
    </>
  );
}
