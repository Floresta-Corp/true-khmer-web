import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData, useFetcher, useSearchParams } from "react-router";
import { Bookmark, Download, Lock, Menu, MoreVertical } from "lucide-react";
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
import { formatPageCount } from "~/features/education/lib/lesson-media";
import type { educationLearnAction } from "~/features/education/services/education-learn.action";
import type { educationLearnLoader } from "~/features/education/services/education-learn.loader";
import type {
  CourseLesson,
  LessonGateState,
  LessonResumePoint,
} from "~/features/education/types";

const HEADING = "text-[17px] font-bold text-[#1A1A2E]";

/**
 * How often a lesson's place is written back while it plays.
 *
 * Often enough that closing the tab loses only a few seconds, rarely enough
 * that an hour-long lesson costs a few hundred small writes rather than tens
 * of thousands. The route skips revalidation for these, so a save is one
 * request and nothing else.
 */
const RESUME_INTERVAL_MS = 10_000;

/** Movement below this is not worth a write — a paused player, mostly. */
const RESUME_STEP_SECONDS = 5;

/**
 * The learner screen.
 *
 * A lesson is recorded as finished when its player says the learner got to the
 * end of it — not when the lesson was opened, which is what this screen used to
 * do and which made "completed" mean "clicked". Because completion is what
 * opens the next lesson and, with the quiz, earns the certificate, the two
 * had to come apart.
 */
export default function CourseLearnPage() {
  const {
    course,
    completedLessonIds: watched,
    unlockedLessonIds: unlocked,
    nextLessonId,
    resumePoints,
    lastLessonId,
  } = useLoaderData<typeof educationLearnLoader>();

  const progress = useFetcher<typeof educationLearnAction>();
  /* Its own fetcher, so a place-keeping write never shows up as the
     completion request the screen reports on. */
  const resume = useFetcher();
  const [searchParams, setSearchParams] = useSearchParams();

  /* Where they were, falling back to the frontier: a learner who went back to
     revise lands on the lesson they were revising, not the one after it. */
  const activeLesson = useMemo(
    () =>
      toActiveLesson(
        course,
        searchParams.get("lesson"),
        lastLessonId ?? nextLessonId,
      )!,
    [course, searchParams, lastLessonId, nextLessonId],
  );

  const flatLessons = useMemo(
    () => course.curriculum.flatMap((section) => section.lessons),
    [course.curriculum],
  );

  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    () => new Set(watched),
  );
  const [unlockedLessonIds, setUnlockedLessonIds] = useState<Set<string>>(
    () => new Set(unlocked),
  );

  useEffect(() => {
    setCompletedLessonIds((current) => {
      if (watched.every((id) => current.has(id))) return current;
      return new Set([...current, ...watched]);
    });
  }, [watched]);

  useEffect(() => {
    setUnlockedLessonIds((current) => {
      if (unlocked.every((id) => current.has(id))) return current;
      return new Set([...current, ...unlocked]);
    });
  }, [unlocked]);

  const [isSaved, setIsSaved] = useState(course.isSaved);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(
    () => new Set([activeLesson.sectionId]),
  );

  /**
   * What the player says about finishing this lesson.
   *
   * Null until the player has measured anything, which is why the Next button
   * starts out shut: "nothing measured yet" must not read as "nothing left".
   */
  const [gate, setGate] = useState<LessonGateState | null>(null);
  const [gateLessonId, setGateLessonId] = useState(activeLesson.id);

  /* The gate belongs to the lesson that produced it. Clearing it here, during
     the render that changes lesson, stops the previous lesson's verdict from
     marking the new one finished before its player has started. */
  if (gateLessonId !== activeLesson.id) {
    setGateLessonId(activeLesson.id);
    setGate(null);
  }

  /* The latest verdict, for the timer and the unload handler to read without
     either of them having to be rebuilt each time it changes. */
  const latestGate = useRef<{ lessonId: string; gate: LessonGateState } | null>(
    null,
  );

  const handleGateChange = useCallback(
    (next: LessonGateState) => {
      latestGate.current = { lessonId: activeLesson.id, gate: next };
      setGate(next);
    },
    [activeLesson.id],
  );

  /**
   * Resume points written during this visit.
   *
   * The loader's copy is from page load, and switching lessons does not
   * revalidate it, so without this a learner who moved on and came back in the
   * same sitting would find the lesson at the beginning again.
   */
  const savedThisVisit = useRef<Map<string, LessonResumePoint>>(new Map());

  const loadedResume = useMemo(
    () => new Map(resumePoints.map((point) => [point.lessonId, point])),
    [resumePoints],
  );

  /* Held still for as long as the lesson is on screen. The players seed their
     counters from it, and re-seeding mid-lesson with our own saves would
     reset the very coverage those saves are recording. */
  const [resumeFor, setResumeFor] = useState(() => ({
    lessonId: activeLesson.id,
    point:
      savedThisVisit.current.get(activeLesson.id) ??
      loadedResume.get(activeLesson.id) ??
      null,
  }));

  if (resumeFor.lessonId !== activeLesson.id) {
    setResumeFor({
      lessonId: activeLesson.id,
      point:
        savedThisVisit.current.get(activeLesson.id) ??
        loadedResume.get(activeLesson.id) ??
        null,
    });
  }

  const activeResume =
    resumeFor.lessonId === activeLesson.id ? resumeFor.point : null;

  const learnAction = `/education/${course.id}/learn`;

  /* One attempt per lesson, so a refused save is not retried in a loop — the
     strip under the player offers it again instead. */
  const attempted = useRef<Set<string>>(new Set());
  const savingLessonId = useRef<string | null>(null);

  const markFinished = useCallback(
    (lessonId: string, watchedSeconds: number | null) => {
      attempted.current.add(lessonId);
      savingLessonId.current = lessonId;

      setCompletedLessonIds((current) => {
        if (current.has(lessonId)) return current;
        const next = new Set(current);
        next.add(lessonId);
        return next;
      });

      progress.submit(
        {
          intent: "complete",
          lessonId,
          ...(watchedSeconds !== null
            ? { watchedSeconds: String(Math.round(watchedSeconds)) }
            : {}),
        },
        { method: "post", action: learnAction },
      );
    },
    /* `progress.submit` rather than the fetcher: the fetcher object is new on
       every render, which would rebuild this callback and re-run the effect
       below for nothing. */
    [learnAction, progress.submit],
  );

  /**
   * Writes where the learner has got to, if it has moved enough to be worth it.
   *
   * Returns the values it sent, so the unload path can build the same body for
   * `sendBeacon` without duplicating the rules about what counts as movement.
   */
  const lastWrite = useRef<{
    lessonId: string;
    position: number;
    watched: number;
  } | null>(null);

  const resumeBody = useCallback((force: boolean) => {
    const snapshot = latestGate.current;
    if (!snapshot) return null;

    const { lessonId, gate: current } = snapshot;
    const position = Math.max(0, Math.round(current.positionSeconds));
    const watched = Math.max(0, Math.round(current.watchedSeconds ?? 0));

    // Nothing has happened yet — do not file an empty place.
    if (position === 0 && watched === 0) return null;

    const previous = lastWrite.current;
    const moved =
      !previous ||
      previous.lessonId !== lessonId ||
      Math.abs(position - previous.position) >= RESUME_STEP_SECONDS ||
      Math.abs(watched - previous.watched) >= RESUME_STEP_SECONDS;

    if (!force && !moved) return null;

    lastWrite.current = { lessonId, position, watched };
    savedThisVisit.current.set(lessonId, {
      lessonId,
      positionSeconds: position,
      watchedSeconds: watched,
      updatedAt: new Date().toISOString(),
    });

    return {
      intent: "resume",
      lessonId,
      positionSeconds: String(position),
      watchedSeconds: String(watched),
    };
  }, []);

  const saveResume = useCallback(
    (force = false) => {
      const body = resumeBody(force);
      if (body) resume.submit(body, { method: "post", action: learnAction });
    },
    [resumeBody, resume.submit, learnAction],
  );

  useEffect(() => {
    const timer = window.setInterval(() => saveResume(), RESUME_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [saveResume]);

  /* Leaving a lesson files where it was left. The cleanup runs before the new
     lesson's player reports anything, so the snapshot in hand is still the
     outgoing lesson's. */
  useEffect(() => {
    return () => saveResume(true);
  }, [activeLesson.id, saveResume]);

  /**
   * Closing the tab is the case this whole feature is for.
   *
   * `pagehide` is the last moment a page reliably gets, and a normal request
   * started there is usually cancelled — `sendBeacon` is the one that survives,
   * so the same body goes out through it instead.
   */
  useEffect(() => {
    const flush = () => {
      const body = resumeBody(true);
      if (!body || typeof navigator.sendBeacon !== "function") return;

      const form = new FormData();
      for (const [key, value] of Object.entries(body)) form.append(key, value);
      navigator.sendBeacon(learnAction, form);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flush();
    };

    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [resumeBody, learnAction]);

  /** A lesson is open once its own lesson, or the one before it, is done. */
  const isUnlocked = useCallback(
    (lesson: CourseLesson) =>
      unlockedLessonIds.has(lesson.id) ||
      completedLessonIds.has(lesson.id) ||
      lesson.isPreview,
    [unlockedLessonIds, completedLessonIds],
  );

  /* A video or audio lesson records itself the moment it has been played
     through; a document waits for the learner to say they have read it. */
  useEffect(() => {
    if (!gate?.isSatisfied) return;
    if (gateLessonId !== activeLesson.id) return;
    if (completedLessonIds.has(activeLesson.id)) return;
    if (attempted.current.has(activeLesson.id)) return;

    /* Never record a lesson the learner has not reached. A locked lesson
       arrives with its media stripped, which a player reads as "nothing to
       play" and reports as finished — so without this, the one route to a
       locked lesson would be the one that completes it. The API refuses it
       too; this keeps the screen from claiming otherwise in the meantime. */
    if (!isUnlocked(activeLesson)) return;

    markFinished(activeLesson.id, gate.watchedSeconds);
  }, [
    gate,
    gateLessonId,
    activeLesson,
    completedLessonIds,
    isUnlocked,
    markFinished,
  ]);

  useEffect(() => {
    if (progress.state !== "idle" || !progress.data) return;

    const result = progress.data;
    const saved = savingLessonId.current;
    savingLessonId.current = null;

    if (result.ok) {
      /* The server's answer replaces the guess: finishing a lesson is what
         opens the next one, and it is the server that decided. */
      if (result.intent === "complete") {
        setUnlockedLessonIds(
          (current) => new Set([...current, ...result.unlockedLessonIds]),
        );
      }
      return;
    }

    if (!saved) return;

    /* Put the lesson back to unfinished: the record is the server's, and
       showing a tick it never accepted would be a lie the certificate later
       contradicts. */
    setCompletedLessonIds((current) => {
      if (!current.has(saved)) return current;
      const next = new Set(current);
      next.delete(saved);
      return next;
    });

    toast.error(result.message);

    /* Refused because an earlier lesson is unfinished — go to that one rather
       than leave the learner on a lesson that will not record. */
    const resume = result.nextLessonId;
    if (result.isLocked && resume && resume !== saved) {
      setSearchParams({ lesson: resume });
    }
  }, [progress.state, progress.data, setSearchParams]);

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

  const canGoNext = Boolean(nextLesson && isUnlocked(nextLesson));

  const goToLesson = (lesson: CourseLesson | undefined) => {
    if (!lesson) return;

    if (!isUnlocked(lesson)) {
      toast.error("Finish this lesson to open the next one.");
      return;
    }

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

  const lessonPages =
    activeLesson.type === "pdf"
      ? formatPageCount(activeLesson.pageCount)
      : null;

  const playerOverlay = (
    <div className="flex items-start justify-between gap-3.5">
      <div className="min-w-0">
        <div className={cn("truncate text-[12.5px]", overlayMutedText)}>
          {activeLesson.sectionTitle} · Chapter {activeLesson.index} of{" "}
          {flatLessons.length}
          {lessonPages && ` · ${lessonPages}`}
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

        {/* {lessonFileUrl && (
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
        )} */}

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
            isLessonUnlocked={isUnlocked}
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
          <LessonPlayer
            lesson={activeLesson}
            flush
            overlay={playerOverlay}
            resume={activeResume}
            onGateChange={handleGateChange}
          />

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
                  disabled={!canGoNext}
                  title={
                    nextLesson && !canGoNext
                      ? "Finish this lesson to open the next one"
                      : undefined
                  }
                  className={navButton}
                >
                  {nextLesson && !canGoNext && (
                    <Lock className="mr-1.5 inline size-3.5" aria-hidden />
                  )}
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
