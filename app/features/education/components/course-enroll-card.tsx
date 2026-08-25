import { useNavigate } from "react-router";
import { CARD } from "~/features/education/lib/education-styles";
import type { CourseDetail } from "~/features/education/types";
import { CoursePriceBadge } from "./course-price-badge";

interface CourseEnrollCardProps {
  course: CourseDetail;
  isEnrolled: boolean;
  onEnroll: () => void;
}

export function CourseEnrollCard({
  course,
  isEnrolled,
  onEnroll,
}: CourseEnrollCardProps) {
  const navigate = useNavigate();
  const started = isEnrolled && course.progressPercent > 0;

  const primaryLabel = !isEnrolled
    ? "Enroll for free"
    : started
      ? "Continue learning"
      : "Start learning";

  const handlePrimaryAction = () => {
    if (!isEnrolled) {
      onEnroll();
      return;
    }
    navigate(`/education/${course.id}/learn`);
  };

  return (
    <div className={`${CARD} p-6`}>
      <h2 className="mb-5 text-[19px] font-bold text-[#1A1A2E]">
        Enroll in this course
      </h2>

      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-sm text-[#9A9AB0]">Price</span>
        <CoursePriceBadge price={course.price} className="rounded-lg text-xs" />
      </div>

      <div className="mb-4.5 flex items-center justify-between gap-3 border-b border-gray-200 pb-4.5">
        <span className="text-sm text-[#9A9AB0]">Enrolled</span>
        <span className="text-sm font-bold text-[#1A1A2E]">
          {course.enrolledCount.toLocaleString()} learners
        </span>
      </div>

      {isEnrolled && (
        <div className="mb-4">
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-[#E8E8E8]">
            <div
              className="h-full rounded-full bg-[#1C5DD4] transition-[width]"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-[#9A9AB0]">
            {course.progressPercent}% complete
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handlePrimaryAction}
        className="w-full cursor-pointer rounded-lg bg-[#1C5DD4] px-4 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#174FB4]"
      >
        {primaryLabel}
      </button>
    </div>
  );
}
