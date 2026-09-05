import { Link } from "react-router";
import { motion } from "motion/react";
import { CourseActionsMenu } from "./course-actions-menu";
import { CourseStatusBadge } from "./course-status-badge";
import { CourseLearnerStats } from "./course-learner-stats";
import {
  displayStatusOf,
  type CourseWithStats,
} from "~/features/course-listing/types";

interface CourseListingRowProps {
  course: CourseWithStats;
  index: number;
}

export function CourseListingRow({ course, index }: CourseListingRowProps) {
  const status = displayStatusOf(course);
  const cover = course.coverImageUrl ?? "/placeholder/images.svg";
  const manageTo = `/course-listing/${course.id}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: Math.min(index, 6) * 0.03 }}
      className="relative flex cursor-pointer items-center gap-6 rounded-2xl bg-white p-4 transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(26,26,46,0.14),0_2px_6px_rgba(26,26,46,0.06)]"
    >
      <span className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#E8E8E8]">
        <img
          src={cover}
          alt=""
          loading="lazy"
          className={
            course.coverImageUrl
              ? "size-full object-cover"
              : "size-full object-contain p-3"
          }
        />
      </span>

      <div className="min-w-0 flex-1">
        <CourseStatusBadge status={status} className="mb-2 inline-block" />
        <h3 className="truncate text-[18px] font-bold text-[#10101E]">
          <Link
            to={manageTo}
            className="rounded-sm after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#305CCD]"
          >
            {course.title}
          </Link>
        </h3>
      </div>

      <div className="min-w-0 flex-1" />

      {course.stats ? (
        <CourseLearnerStats stats={course.stats} className="hidden lg:flex" />
      ) : (
        /* A course nobody has started has no figures to report, so the strip
           collapses to the design's single em dash. */
        <span
          aria-label="No learner figures yet"
          className="hidden shrink-0 text-[#9A9AB0] lg:block"
        >
          —
        </span>
      )}

      <div className="min-w-0 flex-1" />

      <CourseActionsMenu course={course} />
    </motion.article>
  );
}
