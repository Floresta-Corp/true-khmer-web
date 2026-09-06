import { Link } from "react-router";
import { BackLink } from "~/components/back-link";
import { ChevronLeft, ExternalLink, MoreVertical, Pencil } from "lucide-react";
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

export function CourseManageHeader({ course }: { course: MyCourse }) {
  const status = displayStatusOf(course);
  const dated = course.publishedAt ?? course.createdAt;

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
          <Link
            to={`/education/${course.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] px-3.5 py-[9px] text-[13px] font-bold whitespace-nowrap text-[#1C5DD4] transition-colors hover:bg-[#F9FAFC]"
          >
            View live course
            <ExternalLink size={13} strokeWidth={2.2} aria-hidden />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`More actions for ${course.title}`}
              className="flex size-[38px] cursor-pointer items-center justify-center rounded-lg bg-white text-[#9A9AB0] transition-colors hover:bg-[#F9FAFC]"
            >
              <MoreVertical size={18} aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[170px] rounded-lg p-1.5 shadow-[0_8px_24px_rgba(26,26,46,0.14)]"
            >
              <DropdownMenuItem asChild className="gap-2.5 px-3.5 py-2.5">
                <Link to={`/education/${course.id}/edit`}>
                  <Pencil size={15} aria-hidden />
                  Edit course
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
