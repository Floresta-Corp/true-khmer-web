import { Link, useFetcher } from "react-router";
import { motion } from "motion/react";
import { Eye, MoreVertical, SendHorizonal, Undo2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { CourseStatusBadge } from "./course-status-badge";
import { CourseLearnerStats } from "./course-learner-stats";
import {
  displayStatusOf,
  type CourseWithStats,
} from "~/features/course-listing/types";
import { CourseActionsMenu } from "./course-actions-menu";

interface CourseListingRowProps {
  course: CourseWithStats;
  index: number;
}

export function CourseListingRow({ course, index }: CourseListingRowProps) {
  const fetcher = useFetcher();
  const status = displayStatusOf(course);
  const cover = course.coverImageUrl ?? "/placeholder/images.svg";
  const manageTo = `/course-listing/${course.id}`;
  const busy = fetcher.state !== "idle";

  const submitIntent = (intent: string) => {
    fetcher.submit(
      { intent, courseId: course.id },
      { method: "post", action: "/course-listing" },
    );
  };

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

      {course.stats ? (
        <CourseLearnerStats stats={course.stats} className="hidden lg:flex" />
      ) : null}

      <CourseActionsMenu course={course} />
    </motion.article>
  );
}
