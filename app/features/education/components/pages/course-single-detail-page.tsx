import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Bookmark, ChevronLeft, Flag, MoreVertical, Star } from "lucide-react";
import { toast } from "sonner";
import { BackLink } from "~/components/back-link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { EducationPage } from "../education-page";
import { CourseAboutPanel } from "../course-about-panel";
import { CourseRecommendedRail } from "../course-recommended-rail";
import { LessonPlayer } from "../lesson-player";
import { toActiveLesson } from "~/features/education/lib/map-lesson";
import { useCourseSaves } from "~/features/education/hooks/use-course-saves";
import type { educationDetailLoader } from "~/features/education/services/education-detail.loader";

/**
 * A single-lesson course: the lesson plays first, with recommendations rail-side.
 *
 * A multi-chapter course leads with a cover and a curriculum to choose from,
 * but a course that is one lesson has nothing to choose — so the player takes
 * the place of the hero and the chapter list gives way to the rail.
 */
export default function CourseSingleDetailPage() {
  const { course, recommended } = useLoaderData<typeof educationDetailLoader>();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  /* One entry, so the shared list hook covers the player's own bookmark too. */
  const saveable = useMemo(() => [course], [course]);
  const { savedCourseIds, toggleSave } = useCourseSaves(saveable);
  const isSaved = savedCourseIds.has(course.id);

  const lesson = useMemo(() => toActiveLesson(course, null), [course]);

  /* Category, title and the two course actions, laid over the video. */
  function PlayerChrome() {
    const button =
      "flex size-8.5 cursor-pointer items-center justify-center rounded-full bg-black/35 transition-colors hover:bg-black/55";

    return (
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs text-white/75">{course.categoryName}</div>
          <div className="truncate text-[15px] font-bold text-white">
            {course.title}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            aria-label={isSaved ? "Remove from saved" : "Save course"}
            aria-pressed={isSaved}
            onClick={() => toggleSave(course.id)}
            className={button}
          >
            <Bookmark
              aria-hidden
              className={cn(
                "size-4",
                isSaved ? "fill-white text-white" : "fill-none text-white",
              )}
            />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="More options"
                className={button}
              >
                <MoreVertical className="size-4 text-white" aria-hidden />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="min-w-[170px] rounded-[10px] p-1.5 font-tk-edu shadow-[0_8px_28px_rgba(26,26,46,0.14)]"
            >
              <DropdownMenuItem
                onSelect={() =>
                  toast.success("Thanks — this course has been reported.")
                }
                className="gap-2.5 px-3 py-2.5 font-semibold text-[#FB3748] focus:text-[#FB3748]"
              >
                <Flag className="size-4" aria-hidden />
                Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Category", value: course.categoryName },
    { label: "Level", value: course.level },
    {
      label: "Rating",
      value:
        course.ratingCount > 0 ? course.rating.toFixed(1) : "Not rated yet",
      isRating: course.ratingCount > 0,
    },
    {
      label: "Learners",
      value:
        course.studentCount > 0
          ? `${course.studentCount.toLocaleString()} learner${
              course.studentCount === 1 ? "" : "s"
            }`
          : "No learners yet",
    },
  ];

  return (
    <EducationPage>
      <BackLink
        to="/education"
        className="mb-5 flex w-max items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline"
      >
        <ChevronLeft className="size-4" aria-hidden />
        Back to Education
      </BackLink>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
        className="grid items-start gap-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-10"
      >
        {/* Pinned below the 72px sticky navbar so the recommendations stay in
            view while the long right column scrolls. The height cap only bites
            once the rail outgrows the viewport, and it scrolls internally from
            there. Sticky needs the grid item, not the rail itself: `items-start`
            keeps this box content-height while its grid area spans the whole
            row, which is the travel the sticky offset moves through. */}
        <div className="order-2 border-y border-[#E5E7EB] lg:sticky lg:top-[88px] lg:order-1 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:border-y-0 lg:[scrollbar-color:#BBBBBB_transparent] lg:[scrollbar-width:thin]">
          <CourseRecommendedRail courses={recommended} />
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          {lesson ? (
            /* Chrome only over a video, where the design puts it. A PDF or
               audio lesson gets none: the category and title it carried are
               already the h1 and the stats row directly below, and passing an
               overlay for those types makes LessonPlayer band it in dark. */
            lesson.type === "video" ? (
              <LessonPlayer lesson={lesson} overlay={<PlayerChrome />} />
            ) : (
              <LessonPlayer lesson={lesson} />
            )
          ) : (
            <div className="rounded-xl border border-dashed border-[#E5E7EB] px-8 py-16 text-center text-sm text-[#9A9AB0]">
              This lesson has not been published yet.
            </div>
          )}

          <h1 className="mt-6 mb-5 text-2xl leading-[1.2] font-extrabold text-[#1A1A2E] sm:text-[28px]">
            {course.title}
          </h1>

          <dl className="mb-8 flex flex-wrap gap-x-12 gap-y-5 border-b border-[#E5E7EB] pb-7">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="mb-1.5 text-[11px] font-medium tracking-[0.06em] text-[#9A9AB0] uppercase">
                  {stat.label}
                </dt>
                <dd className="flex items-center gap-1.5 text-base font-bold text-[#1A1A2E]">
                  {stat.isRating && (
                    <Star
                      className="size-4 fill-amber-400 text-amber-400"
                      aria-hidden
                    />
                  )}
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <CourseAboutPanel course={course} />
        </div>
      </motion.div>
    </EducationPage>
  );
}
