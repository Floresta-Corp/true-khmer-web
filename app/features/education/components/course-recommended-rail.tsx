import { Link } from "react-router";
import { List } from "lucide-react";
import type { CourseSummary } from "~/features/education/types";

/**
 * The recommendation rail beside a single-lesson course.
 *
 * A sibling of `CourseRecommendedList` rather than a variant of it: the rail is
 * a scrolling column headed like a playlist, labels each entry by category, and
 * carries no save button — the player's own action bar owns saving. Sharing one
 * component would have meant a prop for each of those differences.
 */
export function CourseRecommendedRail({
  courses,
}: {
  courses: CourseSummary[];
}) {
  if (courses.length === 0) return null;

  return (
    /* Flows with the page rather than scrolling in its own box: a capped
       overflow container held the list still until the pointer was over it,
       which read as the rail being stuck. */
    <aside>
      <div className="flex items-center gap-3.5 border-b border-[#E5E7EB] px-5 py-4">
        <List className="size-4.5 shrink-0 text-[#4B5563]" aria-hidden />
        <h2 className="text-[17px] font-bold text-[#1A1A2E]">
          Recommended for you
        </h2>
      </div>

      <div>
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/education/${course.id}`}
            className="flex items-start gap-3.5 border-b border-[#E5E7EB] px-5 py-3.5 transition-colors hover:bg-white"
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
    </aside>
  );
}
