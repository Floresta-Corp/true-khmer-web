import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import type { Question, CategoriesPicker } from "~/services/forum/forum-types";
import DeleteQuestionDialog from "./dialog/delete-question-dialog";
import AskQuestionDialog from "./dialog/ask-question-dialog";

interface MobileAuthorOptionsProps {
  question: Question;
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
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
