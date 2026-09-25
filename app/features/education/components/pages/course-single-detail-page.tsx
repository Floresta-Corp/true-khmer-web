import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useLoaderData } from "react-router";
import { Bookmark, Menu, MoreVertical, Star } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import { EducationPage } from "../education-page";
import { CourseRecommendedRail } from "../course-recommended-rail";
import { CourseReviewRow } from "../course-review-row";
import { CourseReviewsDialog } from "../course-reviews-dialog";
import { RateCourseDialog } from "../rate-course-dialog";
import { InstructorContactButtons } from "../instructor-contact-buttons";
import { StarRating } from "../star-rating";
import { LessonPlayer } from "../lesson-player";
import { toActiveLesson } from "~/features/education/lib/map-lesson";
import { formatPageCount } from "~/features/education/lib/lesson-media";
import { useCourseSaves } from "~/features/education/hooks/use-course-saves";
import type { educationDetailLoader } from "~/features/education/services/education-detail.loader";
import type { educationLearnAction } from "~/features/education/services/education-learn.action";
import type { LessonGateState } from "../../types";

/** How often the place in the lesson is written while it plays. */
const RESUME_INTERVAL_MS = 10_000;

/** How far the learner must move before a resume write is worth making. */
const RESUME_STEP_SECONDS = 5;

/** Extra coverage to earn before retrying a completion the API refused. */
const RETRY_COVERAGE_SECONDS = 15;

const HEADING = "text-[17px] font-bold text-[#1A1A2E]";

const VISIBLE_REVIEWS = 3;

export default function CourseSingleDetailPage() {
  const { course, recommended, progress, ownReview } =
    useLoaderData<typeof educationDetailLoader>();

  const saveable = useMemo(() => [course], [course]);
  const { savedCourseIds, toggleSave } = useCourseSaves(saveable);
  const isSaved = savedCourseIds.has(course.id);

  const lesson = useMemo(() => toActiveLesson(course, null), [course]);

  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isRateOpen, setIsRateOpen] = useState(false);
  const hasRail = recommended.length > 0;
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  /* Progress comes back only for a signed-in visitor, so it doubles as the
     answer to whether there is anyone to record this playback against. */
  const resume = useMemo(
    () =>
      progress?.resumePoints.find((point) => point.lessonId === lesson?.id) ??
      null,
    [progress, lesson?.id],
  );
  const isRecording = Boolean(progress) && Boolean(lesson);
  const [gate, setGate] = useState<LessonGateState | null>(null);
  const latestGate = useRef<LessonGateState | null>(null);

  const handleGateChange = useCallback((next: LessonGateState) => {
    latestGate.current = next;
    setGate(next);
  }, []);

  const [isComplete, setIsComplete] = useState(() =>
    lesson
      ? (progress?.completedLessonIds.includes(lesson.id) ?? false)
      : false,
  );
  const wasCompleteOnLoad = useRef(isComplete);

  const lastWrite = useRef<{ position: number; watched: number } | null>(null);
  const refusedAt = useRef<number | null>(null);

  const completion = useFetcher<typeof educationLearnAction>();
  const resumeFetcher = useFetcher();

  const learnAction = `/education/${course.id}/learn`;

  const resumeBody = useCallback(
    (force: boolean) => {
      const current = latestGate.current;
      if (!current || !lesson) return null;

      const position = Math.max(0, Math.round(current.positionSeconds));
      const watched = Math.max(0, Math.round(current.watchedSeconds ?? 0));

      if (position === 0 && watched === 0) return null;

      const previous = lastWrite.current;
      const moved =
        !previous ||
        Math.abs(position - previous.position) >= RESUME_STEP_SECONDS ||
        Math.abs(watched - previous.watched) >= RESUME_STEP_SECONDS;

      if (!force && !moved) return null;

      lastWrite.current = { position, watched };

      return {
        intent: "resume",
        lessonId: lesson.id,
        positionSeconds: String(position),
        watchedSeconds: String(watched),
      };
    },
    [lesson],
  );

  const saveResume = useCallback(
    (force = false) => {
      const body = resumeBody(force);
      if (body)
        resumeFetcher.submit(body, { method: "post", action: learnAction });
    },
    [resumeBody, resumeFetcher.submit, learnAction],
  );

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => saveResume(), RESUME_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isRecording, saveResume]);

  /* Leaving the page is the one moment the interval cannot cover, and a fetch
     started there is cancelled with the document. */
  useEffect(() => {
    if (!isRecording) return;

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
  }, [isRecording, resumeBody, learnAction]);

  /* Leaving for another course is a client-side navigation: the document stays
     put, so neither listener above fires and the seconds since the last tick
     would be lost. */
  useEffect(() => {
    if (!isRecording) return;
    return () => saveResume(true);
  }, [isRecording, saveResume]);

  useEffect(() => {
    if (!isRecording || isComplete || !lesson) return;
    if (!gate?.isSatisfied) return;

    const watched = gate.watchedSeconds;

    if (
      refusedAt.current !== null &&
      (watched ?? 0) < refusedAt.current + RETRY_COVERAGE_SECONDS
    ) {
      return;
    }
    setIsComplete(true);

    completion.submit(
      {
        intent: "complete",
        lessonId: lesson.id,
        ...(watched !== null
          ? { watchedSeconds: String(Math.round(watched)) }
          : {}),
      },
      { method: "post", action: learnAction },
    );
  }, [gate, isRecording, isComplete, lesson, completion.submit, learnAction]);

  useEffect(() => {
    if (completion.state !== "idle" || !completion.data) return;
    if (completion.data.ok) return;

    refusedAt.current = latestGate.current?.watchedSeconds ?? 0;
    setIsComplete(false);
    toast.error(completion.data.message);
  }, [completion.state, completion.data]);

  const hasAskedForRating = useRef(false);
  useEffect(() => {
    if (ownReview || hasAskedForRating.current) return;
    if (!isRecording) return;

    const isConfirmed =
      completion.state === "idle" &&
      completion.data?.ok === true &&
      completion.data.intent === "complete";

    if (!isConfirmed && !(wasCompleteOnLoad.current && gate?.isSatisfied)) {
      return;
    }

    hasAskedForRating.current = true;
    setIsRateOpen(true);
  }, [completion.state, completion.data, gate, isRecording, ownReview]);
  const isOnMediaBar = lesson?.type === "pdf" || lesson?.type === "audio";

  const overlayButton = cn(
    "flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors",
    isOnMediaBar
      ? "bg-white text-[#4A4A5A] hover:bg-white/80"
      : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/30",
  );

  const overlayMutedText = isOnMediaBar ? "text-[#4A4A5A]" : "text-white/75";
  const overlayStrongText = isOnMediaBar ? "text-[#1A1A2E]" : "text-white";

  const lessonPages =
    lesson?.type === "pdf" ? formatPageCount(lesson.pageCount) : null;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy the link. Copy it from the address bar.");
    }
  };

  const playerOverlay = (
    <div className="flex items-start justify-between gap-3.5">
      <div className="min-w-0">
        <div className={cn("truncate text-[12.5px]", overlayMutedText)}>
          {course.categoryName}
          {lessonPages && ` · ${lessonPages}`}
        </div>
        <div
          className={cn("truncate text-[15px] font-bold", overlayStrongText)}
        >
          {course.title}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          aria-label={isSaved ? "Remove from saved" : "Save course"}
          aria-pressed={isSaved}
          onClick={() => toggleSave(course.id)}
          className={overlayButton}
        >
          <Bookmark
            aria-hidden
            className={cn("size-4", isSaved ? "fill-current" : "fill-none")}
          />
        </button>

        {hasRail && !isPanelOpen && (
          <button
            type="button"
            title="Show recommendations panel"
            aria-label="Show recommendations panel"
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
      label: "Views",
      value: "-",
    },
  ];

  return (
    <EducationPage surface="muted" layout="full">
      <div className="relative flex min-h-0 flex-1 items-stretch overflow-hidden bg-white">
        {hasRail && isPanelOpen && (
          <CourseRecommendedRail
            courses={recommended}
            onClose={() => setIsPanelOpen(false)}
            className="absolute inset-y-0 left-0 z-20 w-full sm:static sm:w-95 sm:shrink-0"
          />
        )}

        <div className="h-full min-w-0 flex-1 overflow-y-auto [scrollbar-color:#BBBBBB_transparent] [scrollbar-width:thin]">
          {lesson ? (
            <LessonPlayer
              lesson={lesson}
              flush
              overlay={playerOverlay}
              resume={resume}
              onGateChange={handleGateChange}
            />
          ) : (
            <div className="border-b border-dashed border-[#E5E7EB] px-8 py-16 text-center text-sm text-[#9A9AB0]">
              This lesson has not been published yet.
            </div>
          )}

          <div className="px-7 pt-5.5 pb-7.5">
            <h1 className="mb-5 text-2xl leading-[1.2] font-extrabold text-[#1A1A2E] sm:text-[28px]">
              {course.title}
            </h1>

            <dl className="mb-7 flex flex-wrap gap-x-12 gap-y-5 border-b border-[#E5E7EB] pb-6">
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

            {course.description && (
              <>
                <h3 className={`${HEADING} mb-3`}>About this lesson</h3>
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
            {course.reviews.length > 0 && (
              <div className="mt-8">
                <h3 className={`${HEADING} mb-5`}>Review</h3>
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
          </div>
        </div>
      </div>

      <RateCourseDialog
        open={isRateOpen}
        onOpenChange={setIsRateOpen}
        courseTitle={course.title}
      />

      <CourseReviewsDialog
        open={isReviewsOpen}
        onOpenChange={setIsReviewsOpen}
        rating={course.rating}
        reviewCount={course.reviewCount}
        reviews={course.reviews}
      />
    </EducationPage>
  );
}
