import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLoaderData,
  useFetcher,
  useSearchParams,
  type ShouldRevalidateFunctionArgs,
} from "react-router";
import { Bookmark, Menu, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { EducationPage } from "../components/education-page";
import { LearnSidebar } from "../components/learn-sidebar";
import { InstructorContactButtons } from "../components/instructor-contact-buttons";
import { LessonPlayer } from "../components/lesson-player";
import { toActiveLesson } from "../lib/map-lesson";
import { educationLearnAction } from "../services/education-learn.action";
import { educationLearnLoader } from "../services/education-learn.loader";
import type { CourseLesson } from "../types";
import type { Route } from "./+types/education.learn.$id";

export const loader = educationLearnLoader;
export const action = educationLearnAction;

/**
 * Moving between lessons only changes `?lesson=`, and the course and its
 * curriculum are identical either way — so the loader is skipped and the new
 * lesson is resolved from the URL in the component. Without this every
 * "Next lesson" click re-ran the whole loader.
 */
export function shouldRevalidate({
  currentUrl,
  nextUrl,
  formMethod,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) {
  // Only plain navigations are skipped — a submission still revalidates.
  if (!formMethod && currentUrl.pathname === nextUrl.pathname) return false;
  return defaultShouldRevalidate;
}

export function meta({ data }: Route.MetaArgs) {
  return [{ title: data?.course.title ?? "Course" }];
}

/** 17px/700 blocks under the player; the design sets their margins apart. */
const HEADING = "text-[17px] font-bold text-[#1A1A2E]";

export default function CourseLearnPage() {
  const { course, completedLessonIds: watched } =
    useLoaderData<typeof loader>();
  const progress = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();

  // Resolved here rather than in the loader, so switching lesson is instant.
  // Non-null: the loader 404s a course with no lessons, so one always
  // resolves — an unknown `?lesson=` falls back to the first.
  const activeLesson = useMemo(
    () => toActiveLesson(course, searchParams.get("lesson"))!,
    [course, searchParams],
  );

  const flatLessons = useMemo(
    () => course.curriculum.flatMap((section) => section.lessons),
    [course.curriculum],
  );

  /**
   * Lessons this learner has watched, seeded from the API so returning to a
   * course does not restart at zero. The optimistic local copy keeps the
   * sidebar ticking immediately; the fetcher persists it.
   */
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    () => new Set(watched),
  );

  // A signed-in learner's saved progress arrives with the loader.
  useEffect(() => {
    setCompletedLessonIds((current) => {
      if (watched.every((id) => current.has(id))) return current;
      return new Set([...current, ...watched]);
    });
  }, [watched]);
  const [isSaved, setIsSaved] = useState(course.isSaved);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(
    () => new Set([activeLesson.sectionId]),
  );

  // The design has no "mark complete" control — a chapter counts as done once
  // the learner has opened it, which is also what keeps the quiz reachable.
  useEffect(() => {
    setCompletedLessonIds((current) => {
      if (current.has(activeLesson.id)) return current;
      const next = new Set(current);
      next.add(activeLesson.id);
      return next;
    });

    // Persist it. A signed-out viewer's POST is refused by the API and the
    // page carries on with the session-only copy above.
    progress.submit(
      { lessonId: activeLesson.id },
      { method: "post", action: `/education/${course.id}/learn` },
    );
    // Deliberately keyed on the lesson alone — `progress` is a stable fetcher
    // and including it would re-submit on every state change it causes.
  }, [activeLesson.id, course.id]);

  useEffect(() => {
    setOpenSectionIds((current) =>
      current.has(activeLesson.sectionId)
        ? current
        : new Set(current).add(activeLesson.sectionId),
    );
  }, [activeLesson.sectionId]);

  const currentIndex = flatLessons.findIndex(
    (lesson) => lesson.id === activeLesson.id,
  );
  const previousLesson = flatLessons[currentIndex - 1];
  const nextLesson = flatLessons[currentIndex + 1];
  const allComplete =
    flatLessons.length > 0 && completedLessonIds.size === flatLessons.length;

  const goToLesson = (lesson: CourseLesson | undefined) => {
    if (!lesson) return;
    setSearchParams({ lesson: lesson.id });
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const navButton =
    "cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1A2E] transition-colors hover:border-[#1C5DD4] hover:text-[#1C5DD4] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#E5E7EB] disabled:hover:text-[#1A1A2E]";

  const overlayButton =
    "flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30";

  const playerOverlay = (
    <div className="flex items-start justify-between gap-3.5">
      <div className="min-w-0">
        <div className="truncate text-[12.5px] text-white/75">
          {activeLesson.sectionTitle} · Chapter {activeLesson.index} of{" "}
          {flatLessons.length}
        </div>
        <div className="truncate text-[15px] font-bold text-white">
          {activeLesson.heading}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          aria-label={isSaved ? "Remove from saved" : "Save course"}
          aria-pressed={isSaved}
          onClick={() => setIsSaved((value) => !value)}
          className={overlayButton}
        >
          <Bookmark
            aria-hidden
            className={cn("size-4", isSaved ? "fill-white" : "fill-none")}
            color="#fff"
          />
        </button>

        {!isPanelOpen && (
          <button
            type="button"
            title="Show content panel"
            aria-label="Show content panel"
            onClick={() => setIsPanelOpen(true)}
            className={overlayButton}
          >
            <Menu className="size-4 text-white" aria-hidden />
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More options"
              className={overlayButton}
            >
              <MoreVertical className="size-4 text-white" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[170px] rounded-[10px] p-1.5 font-tk-edu shadow-[0_8px_28px_rgba(26,26,46,0.14)]"
          >
            <DropdownMenuItem
              onSelect={handleShare}
              className="gap-2.5 px-3 py-2.5 font-semibold"
            >
              Share
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                toast.success("Thanks — this course has been reported.")
              }
              className="gap-2.5 px-3 py-2.5 font-semibold text-[#FB3748] focus:text-[#FB3748]"
            >
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <EducationPage surface="muted" layout="full">
      <div className="flex min-h-0 flex-1 items-stretch overflow-hidden bg-white">
        {isPanelOpen && (
          <LearnSidebar
            course={course}
            title={course.title}
            activeLessonId={activeLesson.id}
            completedLessonIds={completedLessonIds}
            openSectionIds={openSectionIds}
            onToggleSection={(sectionId) =>
              setOpenSectionIds((current) => {
                const next = new Set(current);
                if (next.has(sectionId)) next.delete(sectionId);
                else next.add(sectionId);
                return next;
              })
            }
            onClose={() => setIsPanelOpen(false)}
            lessonIndex={(lesson) =>
              flatLessons.findIndex((l) => l.id === lesson.id) + 1
            }
            totalLessons={flatLessons.length}
            hasQuiz={course.hasQuiz}
            quizUnlocked={allComplete}
          />
        )}

        <div className="h-full min-w-0 flex-1 overflow-y-auto [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin]">
          <LessonPlayer lesson={activeLesson} flush overlay={playerOverlay} />

          <div className="px-7 pt-5.5 pb-7.5">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-5.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {course.hasQuiz && allComplete && (
                  <Link
                    to={`/education/${course.id}/quiz`}
                    className="rounded-full bg-[#1C5DD4] px-5.5 py-2.75 text-sm font-bold text-white transition-colors hover:bg-[#174FB4]"
                  >
                    Take the quiz
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => goToLesson(previousLesson)}
                  disabled={!previousLesson}
                  className={navButton}
                >
                  ‹ Previous
                </button>
                <button
                  type="button"
                  onClick={() => goToLesson(nextLesson)}
                  disabled={!nextLesson}
                  className={navButton}
                >
                  Next ›
                </button>
              </div>
            </div>

            {/* The API has no per-lesson prose, so these two blocks show the
                course's own description and skills — real authored content,
                the same on every chapter. */}
            {course.description && (
              <>
                <h3 className={`${HEADING} mb-3`}>About this course</h3>
                <p className="mb-7 text-base leading-[1.7] text-pretty text-[#333333]">
                  {course.description}
                </p>
              </>
            )}

            {course.outcomes.length > 0 && (
              <>
                <h3 className={`${HEADING} mb-3.5`}>What you&apos;ll learn</h3>
                <ul className="flex list-none flex-col gap-3 p-0">
                  {course.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex gap-3 text-base leading-[1.6] text-[#333333]"
                    >
                      <span className="shrink-0 text-[#9A9AB0]">•</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-7 pt-6">
              <div className="mb-3.5 text-sm font-semibold text-[#9A9AB0]">
                Posted by
              </div>
              <div className="flex items-center gap-3.5">
                <span className="size-11.5 shrink-0 overflow-hidden rounded-full bg-[#E8E8E8]">
                  <img
                    src={
                      course.instructor.avatarUrl ??
                      "/images/avatar_placeholder.webp"
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
            </div>
          </div>
        </div>
      </div>
    </EducationPage>
  );
}
