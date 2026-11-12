import { useState } from "react";
import { Link, useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  PartyPopper,
  Star,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { CARD } from "~/features/education/lib/education-styles";
import { lessonDetail } from "~/features/education/lib/lesson-media";
import type { educationCompleteLoader } from "~/features/education/services/education-complete.loader";
import { EducationPage } from "../education-page";
import { LessonTypeIcon } from "../lesson-type-icon";
import { RateCourseDialog } from "../rate-course-dialog";

export default function CourseCompletePage() {
  const { course, completedOn, ownReview } =
    useLoaderData<typeof educationCompleteLoader>();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [isRateOpen, setIsRateOpen] = useState(false);
  const [hasRated, setHasRated] = useState(ownReview !== null);
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(
    () => new Set(course.curriculum.map((section) => section.id)),
  );

  const lessons = course.curriculum.flatMap((section) => section.lessons);
  const lessonNumber = new Map(
    lessons.map((lesson, index) => [lesson.id, index + 1]),
  );

  const toggleSection = (sectionId: string) =>
    setOpenSectionIds((current) => {
      const next = new Set(current);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });

  return (
    <EducationPage surface="muted">
      <div className="mx-auto max-w-205">
        <Link
          to={`/education/${course.id}`}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline"
        >
          <ChevronLeft className="size-4" aria-hidden />
          Back to course
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration }}
          className={`${CARD} overflow-hidden`}
        >
          {course.coverImageUrl && (
            <img
              src={course.coverImageUrl}
              alt=""
              className="h-40 w-full object-cover sm:h-52"
            />
          )}

          <div className="px-6 py-8 text-center sm:px-10">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#1FC16B]/15">
              <PartyPopper className="size-7 text-[#1FC16B]" aria-hidden />
            </div>
            <span className="mb-3 inline-block rounded-full bg-[#1FC16B]/15 px-4 py-1.5 text-[11px] font-bold tracking-[0.08em] text-[#1FC16B]">
              CLASS COMPLETED
            </span>
            <h1 className="mb-2 text-2xl font-extrabold text-balance text-[#1A1A2E] sm:text-[28px]">
              {course.title}
            </h1>
            <p className="mb-7 text-sm text-[#9A9AB0]">
              Completed on {completedOn} · {lessons.length} chapter
              {lessons.length === 1 ? "" : "s"}
            </p>

            <div className="flex flex-col items-stretch justify-center gap-2.5 sm:flex-row">
              <Link
                to={`/education/${course.id}/certificate`}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#1C5DD4] px-6.5 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-[#174FB4]"
              >
                <Award className="size-4.5" aria-hidden />
                View my certificate
              </Link>
              {!hasRated && (
                <button
                  type="button"
                  onClick={() => setIsRateOpen(true)}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-6.5 py-3.5 text-[15px] font-semibold text-[#1A1A2E] transition-colors hover:border-[#1C5DD4] hover:text-[#1C5DD4]"
                >
                  <Star className="size-4.5" aria-hidden />
                  Rate this course
                </button>
              )}
              <Link
                to="/education/all"
                className="flex items-center justify-center px-6.5 py-3.5 text-[15px] font-semibold text-[#1C5DD4] hover:underline"
              >
                Explore more courses
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration, delay: prefersReducedMotion ? 0 : 0.08 }}
          className={`${CARD} mt-5 overflow-hidden`}
        >
          <div className="flex items-baseline justify-between border-b border-gray-200 px-5 py-4.5">
            <h2 className="text-lg font-bold text-[#1A1A2E]">Curriculum</h2>
            <span className="text-xs text-[#9A9AB0]">Revisit any chapter</span>
          </div>

          {course.curriculum.map((section) => {
            if (section.lessons.length === 0) return null;
            const isOpen = openSectionIds.has(section.id);

            return (
              <div key={section.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleSection(section.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 border-b border-gray-200 bg-white px-5 py-3.5 text-left"
                >
                  <span className="text-sm font-bold text-[#1A1A2E]">
                    {section.title}
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    <span className="text-sm text-[#9A9AB0]">
                      {section.lessons.length}
                    </span>
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-5 text-[#9A9AB0] transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </span>
                </button>

                {isOpen &&
                  section.lessons.map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/education/${course.id}/learn?lesson=${lesson.id}`}
                      className="flex items-center gap-3 border-b border-gray-200 px-5 py-3.5 transition-colors last:border-b-0 hover:bg-gray-50"
                    >
                      <CheckCircle2
                        className="size-5 shrink-0 fill-[#1FC16B] text-white"
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-[#333333]">
                          {lessonNumber.get(lesson.id)}. {lesson.title}
                        </span>
                        <span className="mt-0.75 flex items-center gap-1.25 text-xs text-[#9A9AB0]">
                          <LessonTypeIcon
                            type={lesson.type}
                            className="size-3.25"
                          />
                          <span className="truncate">
                            {lessonDetail(lesson)}
                          </span>
                        </span>
                      </span>
                    </Link>
                  ))}
              </div>
            );
          })}
        </motion.section>
      </div>

      <RateCourseDialog
        open={isRateOpen}
        onOpenChange={setIsRateOpen}
        onRated={() => setHasRated(true)}
        courseTitle={course.title}
      />
    </EducationPage>
  );
}
