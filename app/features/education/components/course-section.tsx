import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { CourseSummary } from "~/features/education/types";
import { CourseCard } from "./course-card";

interface CourseSectionProps {
  title: string;
  courses: CourseSummary[];
  /** Omit to hide the "View all" link. */
  viewAllTo?: string;
  emptyMessage?: string;
  savedCourseIds: Set<string>;
  onToggleSave: (courseId: string) => void;
}

/** A titled row of class cards, as used by "Trending Classes" / "Recently Added". */
export function CourseSection({
  title,
  courses,
  viewAllTo,
  emptyMessage = "No classes here yet.",
  savedCourseIds,
  onToggleSave,
}: CourseSectionProps) {
  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-[22px] font-bold text-[#1A1A2E]">{title}</h2>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#1A1A2E] hover:text-[#1C5DD4]"
          >
            View all
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        )}
      </div>

      {courses.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#E5E7EB] bg-white px-8 py-16 text-center text-sm text-[#6B7280]">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isSaved={savedCourseIds.has(course.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </section>
  );
}
