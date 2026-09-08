import { useEffect, useRef, useState } from "react";
import { Link, useFetcher } from "react-router";
import { toast } from "sonner";
import { BackLink } from "~/components/back-link";
import {
  ChevronLeft,
  EyeOff,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { CourseStatusBadge } from "~/features/course-listing/components/course-status-badge";
import {
  displayStatusOf,
  type MyCourse,
} from "~/features/course-listing/types";
import { DeleteCourseDialog } from "~/features/course-listing/components/delete-course-dialog";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * "14 Jun 2026", as the design writes it. Read in UTC so the day does not shift
 * west of Greenwich or disagree between the server render and the client.
 */
function formatDate(value: string) {
  const date = new Date(value);
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function CourseManageHeader({
  course,
  learnerCount,
}: {
  course: MyCourse;
  learnerCount: number;
}) {
  const status = displayStatusOf(course);
  const dated = course.publishedAt ?? course.createdAt;

  const fetcher = useFetcher<{
    ok: boolean;
    message?: string;
    error?: string;
  }>();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const busy = fetcher.state !== "idle";
  const announced = useRef<unknown>(null);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (announced.current === fetcher.data) return;
    announced.current = fetcher.data;

    if (fetcher.data.ok) {
      toast.success(fetcher.data.message ?? "Course updated.");
      return;
    }

    setConfirmingDelete(false);
    toast.error(fetcher.data.error ?? "That change could not be saved.");
  }, [fetcher.state, fetcher.data]);

  /* A live course cannot be edited — the builder refuses it and says to
     unpublish first — so publishing swaps Edit for the two actions that do
     apply. A draft or unpublished course is the mirror image: nothing to view
     and nothing to unpublish, so editing leads and Delete is all that is left.
     A rejected course is a draft carrying a note, so it belongs here too.
     A successful delete redirects to the listing from the action. */
  const published = course.status === "PUBLISHED";
  const editable = course.status === "DRAFT" || course.status === "UNPUBLISHED";

  const editLink = `/education/${course.id}/edit`;
  const actionButton =
    "flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3.5 py-[9px] text-[13px] font-bold whitespace-nowrap text-[#1C5DD4] transition-colors hover:bg-[#F9FAFC]";

  return (
    <div>
      <BackLink
        to="/course-listing"
        className="mb-[18px] inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline"
      >
        <ChevronLeft size={16} strokeWidth={2.2} aria-hidden />
        My courses
      </BackLink>

      <div className="mb-[22px] flex items-center justify-between gap-5">
        <div className="flex min-w-0 items-center gap-[18px]">
          <span className="h-[70px] w-24 shrink-0 overflow-hidden rounded-lg bg-[#4A4A4A]">
            <img
              src={course.coverImageUrl ?? "/placeholder/images.svg"}
              alt=""
              className={
                course.coverImageUrl
                  ? "size-full object-cover"
                  : "size-full object-contain p-3"
              }
            />
          </span>

          <div className="min-w-0">
            <h1 className="mb-2 line-clamp-2 text-2xl leading-tight font-extrabold text-[#1A1A2E]">
              {course.title}
            </h1>
            <div className="flex items-center gap-2">
              <CourseStatusBadge status={status} />
              <span className="text-[13px] text-[#9A9AB0]">·</span>
              <span className="text-[13px] text-[#9A9AB0]">
                {formatDate(dated)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          {editable ? (
            <Link to={editLink} className={actionButton}>
              Edit
              <Pencil size={13} strokeWidth={2.2} aria-hidden />
            </Link>
          ) : (
            <Link to={`/education/${course.id}`} className={actionButton}>
              View live course
              <ExternalLink size={13} strokeWidth={2.2} aria-hidden />
            </Link>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`More actions for ${course.title}`}
              disabled={busy}
              className="flex size-[38px] cursor-pointer items-center justify-center rounded-lg bg-white text-[#9A9AB0] transition-colors hover:bg-[#F9FAFC] disabled:opacity-50"
            >
              <MoreVertical size={18} aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[170px] rounded-lg p-1.5 shadow-[0_8px_24px_rgba(26,26,46,0.14)]"
            >
              {published && (
                <DropdownMenuItem
                  className="gap-2.5 px-3.5 py-2.5"
                  onSelect={() =>
                    fetcher.submit({ intent: "unpublish" }, { method: "post" })
                  }
                >
                  <EyeOff size={15} aria-hidden />
                  Unpublish
                </DropdownMenuItem>
              )}

              {!published && !editable && (
                <DropdownMenuItem asChild className="gap-2.5 px-3.5 py-2.5">
                  <Link to={editLink}>
                    <Pencil size={15} aria-hidden />
                    Edit course
                  </Link>
                </DropdownMenuItem>
              )}

              {(published || editable) && (
                <DropdownMenuItem
                  className="gap-2.5 px-3.5 py-2.5 text-[#FB3748] focus:text-[#FB3748]"
                  onSelect={() => setConfirmingDelete(true)}
                >
                  <Trash2 size={15} aria-hidden />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteCourseDialog
        open={confirmingDelete}
        courseTitle={course.title}
        learnerCount={learnerCount}
        deleting={busy}
        onConfirm={() =>
          fetcher.submit({ intent: "delete-course" }, { method: "post" })
        }
        onClose={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
