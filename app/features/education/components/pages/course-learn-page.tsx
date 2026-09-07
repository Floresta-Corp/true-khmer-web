import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData, useFetcher, useSearchParams } from "react-router";
import { Bookmark, Download, Menu, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, getSafeExternalUrl } from "~/lib/utils";
import { EducationPage } from "../education-page";
import { LearnSidebar } from "../learn-sidebar";
import { InstructorContactButtons } from "../instructor-contact-buttons";
import { LessonPlayer } from "../lesson-player";
import { toActiveLesson } from "~/features/education/lib/map-lesson";
import type { educationLearnAction } from "~/features/education/services/education-learn.action";
import type { educationLearnLoader } from "~/features/education/services/education-learn.loader";
import type { CourseLesson } from "~/features/education/types";

const HEADING = "text-[17px] font-bold text-[#1A1A2E]";

export default function CourseLearnPage() {
  const { course, completedLessonIds: watched } =
    useLoaderData<typeof educationLearnLoader>();
  const progress = useFetcher<typeof educationLearnAction>();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeLesson = useMemo(
    () => toActiveLesson(course, searchParams.get("lesson"))!,
    [course, searchParams],
  );

  const flatLessons = useMemo(
    () => course.curriculum.flatMap((section) => section.lessons),
    [course.curriculum],
  );

  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    () => new Set(watched),
  );

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

  const savingLessonId = useRef<string | null>(null);

  useEffect(() => {
    setCompletedLessonIds((current) => {
      if (current.has(activeLesson.id)) return current;
      const next = new Set(current);
      next.add(activeLesson.id);
      return next;
    });

    savingLessonId.current = activeLesson.id;
    progress.submit(
      { lessonId: activeLesson.id },
      { method: "post", action: `/education/${course.id}/learn` },
    );
  }, [activeLesson.id, course.id]);

  useEffect(() => {
    if (progress.state !== "idle" || !progress.data) return;

    const saved = savingLessonId.current;
    savingLessonId.current = null;
    if (progress.data.ok || !saved) return;

    setCompletedLessonIds((current) => {
      if (!current.has(saved)) return current;
      const next = new Set(current);
      next.delete(saved);
      return next;
    });

    toast.error("Could not save your progress for this lesson.");
  }, [progress.state, progress.data]);

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

  const completedInCourse = useMemo(() => {
    const ids = new Set<string>();
    for (const lesson of flatLessons) {
      if (completedLessonIds.has(lesson.id)) ids.add(lesson.id);
    }
    return ids;
  }, [flatLessons, completedLessonIds]);

  const allComplete =
    flatLessons.length > 0 && completedInCourse.size === flatLessons.length;

  const goToLesson = (lesson: CourseLesson | undefined) => {
    if (!lesson) return;
    setSearchParams({ lesson: lesson.id });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy the link. Copy it from the address bar.");
    }
  };

  const navButton =
    "cursor-pointer rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#1A1A2E] transition-colors hover:border-[#1C5DD4] hover:text-[#1C5DD4] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[#E5E7EB] disabled:hover:text-[#1A1A2E]";

  const isOnMediaBar =
    activeLesson.type === "pdf" || activeLesson.type === "audio";

  const overlayButton = cn(
    "flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
    isOnMediaBar
      ? "bg-white text-[#4A4A5A] hover:bg-white/80"
      : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30",
  );

  const overlayMutedText = isOnMediaBar ? "text-[#4A4A5A]" : "text-white/75";
  const overlayStrongText = isOnMediaBar ? "text-[#1A1A2E]" : "text-white";

  const lessonFileUrl = isOnMediaBar
    ? getSafeExternalUrl(activeLesson.sourceUrl)
    : undefined;

  const playerOverlay = (
    <div className="flex items-start justify-between gap-3.5">
      <div className="min-w-0">
        <div className={cn("truncate text-[12.5px]", overlayMutedText)}>
          {activeLesson.sectionTitle} · Chapter {activeLesson.index} of{" "}
          {flatLessons.length}
        </div>
        <div
          className={cn("truncate text-[15px] font-bold", overlayStrongText)}
        >
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
            className={cn("size-4", isSaved ? "fill-current" : "fill-none")}
          />
        </button>

        {lessonFileUrl && (
          <a
            href={lessonFileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            title="Download this lesson"
            aria-label="Download this lesson"
            className={overlayButton}
          >
            <Download className="size-4" aria-hidden />
          </a>
        )}

        {!isPanelOpen && (
          <button
            type="button"
            title="Show content panel"
            aria-label="Show content panel"
            onClick={() => setIsPanelOpen(true)}
            className={overlayButton}
          >
            <Menu className="size-4" aria-hidden />
          </button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More options"
              className={overlayButton}
            >
              <MoreVertical className="size-4" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-42.5 rounded-[10px] p-1.5 font-tk-edu shadow-[0_8px_28px_rgba(26,26,46,0.14)]"
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
            activeLessonId={activeLesson.id}
            completedLessonIds={completedInCourse}
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

            {course.skills.length > 0 && (
              <div className="mt-7">
                <h3 className={`${HEADING} mb-3.5`}>Skills</h3>
                <div className="flex flex-wrap items-center gap-2.5">
                  {course.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-[#F1F3F7] px-3.5 py-2 text-sm font-semibold text-[#1A1A2E]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
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
