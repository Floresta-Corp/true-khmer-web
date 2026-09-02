import { Link } from "react-router";
import { Bookmark } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CourseSummary } from "~/features/education/types";

interface CourseRecommendedListProps {
  courses: CourseSummary[];
  savedIds: Set<string>;
  onToggleSave: (courseId: string) => void;
}

/**
 * The "Recommended for you" rail under the detail screen's curriculum panel.
 *
 * Rows are separated by a rule rather than boxed — the design's own treatment —
 * with an 84x56 cover and a save toggle at the end of each row.
 */
export function CourseRecommendedList({
  courses,
  savedIds,
  onToggleSave,
}: CourseRecommendedListProps) {
  if (courses.length === 0) return null;

  return (
    <div className="mt-7">
      <h3 className="mb-3.5 text-[19px] font-bold text-[#1A1A2E]">
        Recommended for you
      </h3>

      <div className="bg-white">
        {courses.map((course, index) => {
          const isSaved = savedIds.has(course.id);

          return (
            <Link
              key={course.id}
              to={`/education/${course.id}`}
              className={cn(
                "flex items-center gap-3.5 py-3.5 transition-colors hover:bg-gray-100",
                index < courses.length - 1 && "border-b border-[#E5E7EB]",
              )}
            >
              <span className="h-14 w-21 shrink-0 overflow-hidden rounded-md bg-[#E8E8E8]">
                <img
                  src={course.coverImageUrl ?? "/placeholder/images.svg"}
                  alt=""
                  className="size-full object-cover"
                />
              </span>

              <div className="min-w-0 flex-1">
                <div className="mb-[3px] text-[11px] tracking-[0.04em] text-[#9A9AB0] uppercase">
                  Course
                </div>
                <div className="mb-1 line-clamp-2 text-sm leading-[1.3] font-bold text-[#1A1A2E]">
                  {course.title}
                </div>
                {/* The design shows a learner count; enrolment has no API
                    resource yet, so the lesson count stands in until it does
                    rather than every row reading "0 learners". */}
                <div className="text-xs text-[#9A9AB0]">
                  {course.studentCount > 0
                    ? `${course.studentCount.toLocaleString()} learners`
                    : `${course.lessonCount} lesson${course.lessonCount === 1 ? "" : "s"}`}
                </div>
              </div>

              <button
                type="button"
                aria-label={isSaved ? "Remove from saved" : "Save course"}
                aria-pressed={isSaved}
                onClick={(event) => {
                  event.preventDefault();
                  onToggleSave(course.id);
                }}
                className="flex size-7.5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white"
              >
                <Bookmark
                  aria-hidden
                  className={cn(
                    "size-3.5",
                    isSaved
                      ? "fill-[#1C5DD4] text-[#1C5DD4]"
                      : "fill-none text-[#9A9AB0]",
                  )}
                />
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
