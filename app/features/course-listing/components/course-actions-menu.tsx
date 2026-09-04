import type { ReactNode } from "react";
import { Link, useFetcher } from "react-router";
import { Eye, MoreVertical, SendHorizonal, Undo2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import type { MyCourse } from "~/features/course-listing/types";

/**
 * The status actions a course offers, shared by the list row and the grid card
 * so the two views can never drift on what is permitted. `triggerClassName`
 * carries the only difference: the card floats it over the cover.
 */
export function CourseActionsMenu({
  course,
  triggerClassName,
  triggerIcon,
}: {
  course: MyCourse;
  triggerClassName?: string;
  triggerIcon?: ReactNode;
}) {
  const fetcher = useFetcher();
  const busy = fetcher.state !== "idle";

  const submitIntent = (intent: string) => {
    fetcher.submit(
      { intent, courseId: course.id },
      { method: "post", action: "/course-listing" },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Actions for ${course.title}`}
        disabled={busy}
        className={cn(
          "relative z-10 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:opacity-50",
          triggerClassName ??
            "text-gray-400 hover:bg-gray-50 hover:text-gray-600",
        )}
      >
        {triggerIcon ?? <MoreVertical size={18} aria-hidden />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl">
        <DropdownMenuItem asChild>
          <Link to={`/education/${course.id}`}>
            <Eye size={16} aria-hidden />
            View live course
          </Link>
        </DropdownMenuItem>

        {(course.status === "DRAFT" || course.status === "UNPUBLISHED") && (
          <DropdownMenuItem onSelect={() => submitIntent("submit")}>
            <SendHorizonal size={16} aria-hidden />
            Submit for review
          </DropdownMenuItem>
        )}

        {course.status === "PENDING" && (
          <DropdownMenuItem onSelect={() => submitIntent("withdraw")}>
            <Undo2 size={16} aria-hidden />
            Withdraw submission
          </DropdownMenuItem>
        )}

        {course.status === "PUBLISHED" && (
          <DropdownMenuItem onSelect={() => submitIntent("unpublish")}>
            <Undo2 size={16} aria-hidden />
            Unpublish
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
