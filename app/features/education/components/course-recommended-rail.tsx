import { Link } from "react-router";
import { BackLink } from "~/components/back-link";
import { ChevronLeft, List, X } from "lucide-react";
import type { CourseSummary } from "~/features/education/types";

export function CourseRecommendedRail({
  courses,
  onClose,
}: {
  courses: CourseSummary[];
  onClose: () => void;
}) {
  return (
    <div className="flex h-full w-95 shrink-0 flex-col border-r border-[#E5E7EB] bg-white">
      <div className="border-b border-[#E5E7EB] px-5 py-3.5">
        <BackLink
          to="/education"
          className="inline-flex min-w-0 items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] transition-colors hover:underline"
        >
          <ChevronLeft className="size-4 shrink-0" aria-hidden />
          <span className="truncate">Back to Education</span>
        </BackLink>
      </div>

      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <List className="size-4.5 shrink-0 text-[#1A1A2E]" aria-hidden />
          <h2 className="truncate text-lg font-bold text-[#1A1A2E]">
            Recommended for you
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          title="Close recommendations panel"
          aria-label="Close recommendations panel"
          className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-gray-100"
        >
          <X className="size-4 text-[#9A9AB0]" aria-hidden />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin]">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/education/${course.id}`}
            className="flex items-start gap-3.5 border-b border-[#E5E7EB] px-5 py-3.5 transition-colors hover:bg-[#F5F6F8]"
          >
            <span className="h-10.5 w-14.5 shrink-0 overflow-hidden rounded-md bg-[#E8E8E8]">
              <img
                src={course.coverImageUrl ?? "/placeholder/images.svg"}
                alt=""
                className="size-full object-cover"
              />
            </span>

            <div className="min-w-0 flex-1">
              <div className="mb-[3px] text-[10px] font-medium tracking-[0.06em] text-[#9A9AB0] uppercase">
                {course.categoryName}
              </div>
              <div className="mb-1 line-clamp-2 text-sm leading-[1.3] font-bold text-[#1A1A2E]">
                {course.title}
              </div>
              <div className="text-xs text-[#9A9AB0]">
                {course.studentCount > 0
                  ? `${course.studentCount.toLocaleString()} learners`
                  : `${course.lessonCount} lesson${course.lessonCount === 1 ? "" : "s"}`}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
