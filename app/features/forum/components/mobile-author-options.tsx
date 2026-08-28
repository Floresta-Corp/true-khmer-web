import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { QuestionResponse } from "~/types/api-client";
import type { CategoriesPicker } from "~/features/forum/types";
import DeleteQuestionDialog from "./dialog/delete-question-dialog";
import AskQuestionDialog from "./dialog/ask-question-dialog";

interface MobileAuthorOptionsProps {
  question: QuestionResponse;
  categories: CategoriesPicker[];
}

export default function MobileAuthorOptions({
  question,
  categories,
}: MobileAuthorOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-xl bg-[#f9fafb] text-[#99a1af] hover:bg-[#f1f5f9] hover:text-[#344256]"
          aria-label="More actions"
        >
          <EllipsisVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <div className="w-full cursor-pointer px-3 py-2">
            <AskQuestionDialog
              categories={categories.filter((c) => c.id !== "all-categories")}
              isEditing
              data={question}
              trigger={
                <span className="flex w-full items-center gap-2 text-sm">
                  <Pencil className="size-3.5" />
                  Edit
                </span>
              }
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div className="w-full cursor-pointer px-3 py-2">
            <DeleteQuestionDialog
              questionId={question.id}
              trigger={
                <span className="flex w-full items-center gap-2 text-sm text-red-600">
                  <Trash2 className="size-3.5" />
                  Delete
                </span>
              }
            />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
