import type { ReactNode } from "react";
import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router";

import { CourseStatusBadge } from "~/features/course-listing/components/course-status-badge";
import { displayStatusOf } from "~/features/course-listing/types";
import { formatDate, formatRelativeTime } from "~/lib/time";
import type { CourseCreator } from "~/api/admin/education-center/education-center.server";
import type { CourseResponse } from "~/types/api-client";

interface ManageEducationRowProps {
  course: CourseResponse;
  categoryName: string | null;
  creator: CourseCreator | null;
  index: number;
  actions?: ReactNode;
}

/**
 * The workspace Course Listing row, rebuilt for review: the creator's learner
 * stats column has nothing behind it on the admin API, so that slot carries
 * what a reviewer actually needs — who wrote the course, its category, and
 * when it was last touched.
 */
export default function ManageEducationRow({
  course,
  categoryName,
  creator,
  index,
  actions,
}: ManageEducationRowProps) {
  const status = displayStatusOf(course);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, delay: Math.min(index, 6) * 0.03 }}
      className="relative flex items-center gap-5 rounded-2xl bg-white p-4 transition-shadow duration-200 hover:shadow-[0_6px_20px_rgba(26,26,46,0.14),0_2px_6px_rgba(26,26,46,0.06)] dark:bg-slate-900 dark:hover:shadow-[0_6px_20px_rgba(0,0,0,0.5)]"
    >
      <span className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#E8E8E8] dark:bg-slate-800">
        {course.coverImageUrl ? (
          <img
            src={course.coverImageUrl}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-slate-400 dark:text-slate-600">
            <GraduationCap size={22} />
          </span>
        )}
      </span>

      {/* The title takes the row's slack. A fixed width here (as the workspace
          row uses) truncated the title while an empty spacer sat beside it. */}
      <div className="min-w-0 flex-1">
        <CourseStatusBadge status={status} className="mb-2 inline-block" />
        <h3 className="truncate text-[18px] font-bold text-[#10101E] dark:text-white">
          <Link
            to={`/tk-admin/manage-education/${course.id}`}
            className="rounded-sm after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#305CCD]"
          >
            {course.title}
          </Link>
        </h3>
      </div>

      {/* Reviewer detail. Every column is fixed-width, so it only appears once
          the row is wide enough to hold it and the actions together — at `lg`
          it pushed the buttons past the card edge. */}
      <div className="hidden shrink-0 items-start gap-5 xl:flex">
        {/* Fixed column widths, not max-widths: sized to content, a long
            email widened this column and shifted the whole block, so the
            three columns never lined up from one row to the next. */}
        <div className="w-36">
          <p className="text-[12px] text-[#86869E]">Created by</p>
          <p className="truncate text-[18px] leading-tight font-bold text-[#10101E] dark:text-slate-100">
            {creator?.name ?? "Unknown creator"}
          </p>
          <p className="truncate text-[11px] text-[#83839B]">
            {creator?.email ?? "Could not be looked up"}
          </p>
        </div>

        <div className="w-36 border-l border-[#E5E7EB] pl-5 dark:border-slate-700">
          <p className="text-[12px] text-[#86869E]">Category</p>
          <p className="truncate text-[18px] leading-tight text-[#10101E] dark:text-slate-100">
            {categoryName ?? "Uncategorised"}
          </p>
          <p className="truncate text-[11px] text-[#83839B]">
            Created {formatDate(course.createdAt)}
          </p>
        </div>

        <div className="w-36">
          <p className="text-[12px] whitespace-nowrap text-[#86869E]">
            Last updated
          </p>
          <p className="truncate text-[18px] leading-tight text-[#10101E] dark:text-slate-100">
            {formatDate(course.updatedAt)}
          </p>
          <p className="truncate text-[11px] text-[#83839B]">
            {formatRelativeTime(course.updatedAt)}
          </p>
        </div>
      </div>

      {actions && (
        <div className="relative z-10 flex shrink-0 items-center gap-2">
          {actions}
        </div>
      )}
    </motion.article>
  );
}
