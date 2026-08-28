import { Link } from "react-router";
import { Bookmark, Clock, Star, Users } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CourseSummary } from "~/features/education/types";
import { CourseLevelMeter } from "./course-level-meter";

interface CourseCardProps {
  course: CourseSummary;
  isSaved: boolean;
  onToggleSave: (courseId: string) => void;
}

export function CourseCard({ course, isSaved, onToggleSave }: CourseCardProps) {
  return (
    <Link
      to={`/education/${course.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#E5E7EB] bg-white transition-shadow hover:shadow-[0_4px_20px_rgba(26,26,46,0.10)]"
    >
      <div className="relative aspect-[16/9] shrink-0 overflow-hidden bg-[#E8E8E8]">
        <img
          src={course.coverImageUrl ?? "/placeholder/images.svg"}
          alt=""
          className="size-full object-cover"
        />

        {course.isNew && (
          <span className="absolute top-3 left-3 rounded-full bg-[#16A34A] px-2.5 py-1 text-[11px] font-semibold text-white">
            New
          </span>
        )}

        <button
          type="button"
          aria-label={isSaved ? "Remove from saved" : "Save course"}
          aria-pressed={isSaved}
          onClick={(event) => {
            event.preventDefault();
            onToggleSave(course.id);
          }}
          className="absolute top-3 right-3 flex size-8 cursor-pointer items-center justify-center rounded-lg bg-white/95 transition-colors hover:bg-white"
        >
          <Bookmark
            aria-hidden
            className={cn(
              "size-4",
              isSaved
                ? "fill-[#1C5DD4] text-[#1C5DD4]"
                : "fill-none text-[#4B5563]",
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-3.5 pb-0">
        <p className="mb-1.5 text-[11px] font-medium tracking-[0.06em] text-[#6B7280] uppercase">
          {course.categoryName}
        </p>

        <h3 className="mb-4 line-clamp-2 text-base leading-snug font-bold text-[#1A1A2E]">
          {course.title}
        </h3>

        <div className="mt-auto flex items-center gap-2 pb-3.5">
          <span className="size-6 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
            <img
              src={
                course.instructor.avatarUrl ?? "/images/avatar_placeholder.webp"
              }
              alt=""
              className="size-full object-cover object-top"
            />
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px] text-[#4B5563]">
            {course.instructor.name}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-[13px] text-[#1A1A2E]">
            <Star
              className="size-3.5 fill-amber-400 text-amber-400"
              aria-hidden
            />
            <span className="font-bold">{course.rating.toFixed(1)}</span>
            <span className="text-[#6B7280]">({course.ratingCount})</span>
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#E5E7EB] px-4 py-2.5 text-[12px] text-[#6B7280]">
        <span className="flex items-center gap-1.5">
          <CourseLevelMeter level={course.level} />
          {course.level}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3.5" aria-hidden />
          {course.lessonCount} lessons
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="size-3.5" aria-hidden />
          {course.studentCount.toLocaleString()}
        </span>
      </div>
    </Link>
  );
}
