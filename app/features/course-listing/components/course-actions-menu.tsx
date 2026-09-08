import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useFetcher } from "react-router";
import { toast } from "sonner";
import { Eye, EyeOff, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import type { MyCourse } from "~/features/course-listing/types";
import { DeleteCourseDialog } from "./delete-course-dialog";

type Intent = "unpublish" | "delete";

const DONE: Record<Intent, string> = {
  unpublish: "Course unpublished.",
  delete: "Course deleted.",
};

/**
 * The status actions a course offers, shared by the list row and the grid card
 * so the two views can never drift on what is permitted. `triggerClassName`
 * carries the only difference: the card floats it over the cover.
 */
export function CourseActionsMenu({
  course,
  learnerCount,
  triggerClassName,
  triggerIcon,
}: {
  course: MyCourse;
  learnerCount?: number;
  triggerClassName?: string;
  triggerIcon?: ReactNode;
}) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const busy = fetcher.state !== "idle";
  const announced = useRef<unknown>(null);
  const lastIntent = useRef<Intent | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const submitIntent = (intent: Intent) => {
    lastIntent.current = intent;
    fetcher.submit(
      { intent, courseId: course.id },
      { method: "post", action: "/course-listing" },
    );
  };

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (announced.current === fetcher.data) return;
    announced.current = fetcher.data;

    if (fetcher.data.ok) {
      toast.success(DONE[lastIntent.current ?? "unpublish"]);
      return;
    }

    setConfirmingDelete(false);
    toast.error(fetcher.data.error ?? "That change could not be saved.");
  }, [fetcher.state, fetcher.data]);

  const editable = course.status === "DRAFT" || course.status === "UNPUBLISHED";

  return (
    <>
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
          {/* Only a published course has a public page; for anything else that
              link is a 404 for every visitor but its owner, so it is offered
              where the course is live and where it is awaiting review. */}
          {(course.status === "PUBLISHED" || course.status === "PENDING") && (
            <DropdownMenuItem asChild>
              <Link to={`/education/${course.id}`}>
                <Eye size={16} aria-hidden />
                View live course
              </Link>
            </DropdownMenuItem>
          )}

          {course.status === "PUBLISHED" && (
            <DropdownMenuItem onSelect={() => submitIntent("unpublish")}>
              <EyeOff size={16} aria-hidden />
              Unpublish
            </DropdownMenuItem>
          )}

          {/* A rejected course comes back as DRAFT, so it is editable here too.
              A course under review is not: the builder locks it. */}
          {editable && (
            <DropdownMenuItem asChild>
              <Link to={`/education/${course.id}/edit`}>
                <Pencil size={16} aria-hidden />
                Edit
              </Link>
            </DropdownMenuItem>
          )}

          {(course.status === "PUBLISHED" || editable) && (
            <DropdownMenuItem
              className="text-[#FB3748] focus:text-[#FB3748]"
              onSelect={() => setConfirmingDelete(true)}
            >
              <Trash2 size={16} aria-hidden />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteCourseDialog
        open={confirmingDelete}
        courseTitle={course.title}
        learnerCount={learnerCount}
        deleting={busy}
        onConfirm={() => submitIntent("delete")}
        onClose={() => setConfirmingDelete(false)}
      />
    </>
  );
}
