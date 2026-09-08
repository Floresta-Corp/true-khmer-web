import { useState } from "react";
import { Check, Folder, Pencil, Trophy } from "lucide-react";
import { InstructorContactButtons } from "./instructor-contact-buttons";
import { CourseReviewRow } from "./course-review-row";
import { CourseReviewsDialog } from "./course-reviews-dialog";
import { StarRating } from "./star-rating";
import type { CourseDetail } from "~/features/education/types";

const HEADING = "mb-3.5 text-[19px] font-bold text-[#1A1A2E]";

const VISIBLE_REVIEWS = 3;

/**
 * Everything a course says about itself: what's included, the description,
 * outcomes, skills, the instructor, and reviews.
 *
 * Shared by both detail layouts — the multi-chapter page puts it in the left
 * column beside the curriculum, the single-lesson page stacks it under the
 * player — so the two cannot drift apart. The reviews dialog is owned here
 * rather than by each page, since nothing outside this panel opens it.
 */
export function CourseAboutPanel({ course }: { course: CourseDetail }) {
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const included = [
    {
      icon: Folder,
      label: `${course.lessonCount} lesson${course.lessonCount === 1 ? "" : "s"}`,
    },
    ...(course.hasQuiz ? [{ icon: Pencil, label: "Final quiz" }] : []),
    ...(course.certificateKind
      ? [
          {
            icon: Trophy,
            label:
              course.certificateKind === "COMPLETION"
                ? "Certificate of completion"
                : "Certificate of participation",
          },
        ]
      : []),
  ];

  return (
    <>
      <div className="mb-3.5 text-[11px] font-bold tracking-[0.08em] text-[#9A9AB0]">
        WHAT&apos;S INCLUDED
      </div>
      <div className="mb-8 flex flex-col gap-3.5">
        {included.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="size-5 shrink-0 text-[#9A9AB0]" aria-hidden />
            <span className="text-sm text-[#333333]">{label}</span>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h3 className={HEADING}>Course description</h3>
        <p className="text-sm leading-[1.65] text-pretty text-[#333333]">
          {course.description}
        </p>
      </div>

      {course.outcomes.length > 0 && (
        <div className="mb-8">
          <h3 className={HEADING}>What you&apos;ll learn</h3>
          <div className="flex flex-col gap-2.5">
            {course.outcomes.map((outcome) => (
              <div
                key={outcome}
                className="flex items-start gap-2.5 text-sm text-[#333333]"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[#1FC16B]"
                  aria-hidden
                />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {course.skills.length > 0 && (
        <div className="mb-8">
          <h3 className={HEADING}>Skills</h3>
          <div className="flex flex-wrap gap-2.5">
            {course.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg bg-[#E8E8E8] px-3.5 py-2 text-sm font-semibold text-[#333333]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-wrap items-center gap-3.5">
        <span className="size-11.5 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
          <img
            src={
              course.instructor.avatarUrl ?? "/images/avatar_placeholder.webp"
            }
            alt=""
            className="size-full object-cover"
          />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-base font-bold text-[#1A1A2E]">
            {course.instructor.name}
          </div>
          <div className="text-xs text-[#9A9AB0]">
            {course.instructor.coursesPublished > 0
              ? `${course.instructor.coursesPublished} course${
                  course.instructor.coursesPublished === 1 ? "" : "s"
                } published`
              : "Instructor"}
          </div>
        </div>
        <InstructorContactButtons
          phone={course.instructor.phone}
          email={course.instructor.email}
        />
      </div>

      {course.reviews.length > 0 && (
        <div>
          <h3 className="mb-5 text-[19px] font-bold text-[#1A1A2E]">Review</h3>
          <div className="mb-5 flex items-center gap-4">
            <span className="text-[38px] leading-none font-extrabold text-[#1A1A2E]">
              {course.rating.toFixed(1)}
            </span>
            <div>
              <StarRating value={course.rating} />
              <div className="mt-1 text-xs text-[#9A9AB0]">
                {course.reviewCount.toLocaleString()} reviews
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4.5">
            {course.reviews.slice(0, VISIBLE_REVIEWS).map((review) => (
              <CourseReviewRow key={review.id} review={review} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsReviewsOpen(true)}
            className="mt-5 cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1C5DD4] transition-colors hover:border-[#1C5DD4] hover:bg-[#EFF4FE]"
          >
            Show all reviews
          </button>
        </div>
      )}

      <CourseReviewsDialog
        open={isReviewsOpen}
        onOpenChange={setIsReviewsOpen}
        rating={course.rating}
        reviewCount={course.reviewCount}
        reviews={course.reviews}
      />
    </>
  );
}
