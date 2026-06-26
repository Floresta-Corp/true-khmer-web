import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { QuestionResponse } from "~/types/api-client";
import type { CategoriesPicker } from "~/features/forum/types";
import AskQuestionDialog from "./dialog/ask-question-dialog";
import DeleteQuestionDialog from "./dialog/delete-question-dialog";

interface QuestionActionsDropdownProps {
  question: QuestionResponse;
  categories: CategoriesPicker[];
  /**
   * Align prop forwarded to DropdownMenuContent (default: "end")
   * Accepts values supported by your DropdownMenu implementation, usually "start" | "end".
   */
  align?: "start" | "end";
  /**
   * Optional className to apply to the trigger button
   */
  triggerClassName?: string;
}

/**
 * Reusable dropdown that exposes Edit / Delete actions for a question.
 * Mirrors the inline dropdown used previously in `forum-content-new`.
 *
 * Usage:
 * <QuestionActionsDropdown question={q} categories={categories} align="end" />
 */
export default function QuestionActionsDropdown({
  question,
  categories,
  align = "end",
  triggerClassName = "h-8 w-8 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]",
}: QuestionActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={triggerClassName}
          aria-label="More actions"
        >
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        <DropdownMenuItem asChild>
          <div className="w-full px-3 py-2">
            <AskQuestionDialog
              categories={categories.filter((c) => c.id !== "all-categories")}
              isEditing
              data={question}
              trigger={<span className="w-full">Edit</span>}
            />
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <div className="w-full px-3 py-2">
            <DeleteQuestionDialog
              questionId={question.id}
              trigger={<span className="w-full">Delete</span>}
            />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
