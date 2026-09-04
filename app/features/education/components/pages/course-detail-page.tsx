import { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Check, Folder, Pencil, Trophy } from "lucide-react";
import { toast } from "sonner";
import { getSafeExternalUrl } from "~/lib/utils";
import { EducationPage } from "../education-page";
import { CourseActionBar } from "../course-action-bar";
import { CourseDetailCurriculum } from "../course-detail-curriculum";
import { CourseDetailHero } from "../course-detail-hero";
import { InstructorContactButtons } from "../instructor-contact-buttons";
import { CourseRecommendedList } from "../course-recommended-list";
import { CourseReviewRow } from "../course-review-row";
import { CourseReviewsDialog } from "../course-reviews-dialog";
import { StarRating } from "../star-rating";
import type { educationDetailLoader } from "~/features/education/services/education-detail.loader";

const HEADING = "mb-3.5 text-[19px] font-bold text-[#1A1A2E]";

const VISIBLE_REVIEWS = 3;

export default function CourseDetailPage() {
  const { course, recommended } = useLoaderData<typeof educationDetailLoader>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [isSaved, setIsSaved] = useState(course.isSaved);
  const [savedRecommendations, setSavedRecommendations] = useState<Set<string>>(
    () => new Set(recommended.filter((c) => c.isSaved).map((c) => c.id)),
  );
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);

  const saveFetcher = useFetcher<{ ok: boolean; error?: string }>();
  const attempted = useRef<boolean | null>(null);
  const announced = useRef<unknown>(null);

  const toggleSave = () => {
    const next = !isSaved;
    attempted.current = next;
    setIsSaved(next);
    saveFetcher.submit(
      { intent: next ? "save" : "unsave", courseId: course.id },
      { method: "post", action: "/my-classes" },
    );
  };

  useEffect(() => {
    if (saveFetcher.state !== "idle" || !saveFetcher.data) return;
    if (announced.current === saveFetcher.data) return;
    announced.current = saveFetcher.data;

    if (saveFetcher.data.ok) return;

    if (attempted.current !== null) setIsSaved(!attempted.current);
    toast.error(saveFetcher.data.error ?? "That course could not be saved.");
  }, [saveFetcher.state, saveFetcher.data]);

  const toggleRecommendationSave = (courseId: string) =>
    setSavedRecommendations((current) => {
      const next = new Set(current);
      if (next.has(courseId)) next.delete(courseId);
      else next.add(courseId);
      return next;
    });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: course.title, url });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy the link. Copy it from the address bar.");
    }
  };

  const downloadable = course.curriculum
    .flatMap((section) => section.lessons)
    .filter((lesson) => lesson.type === "pdf")
    .map((lesson) => getSafeExternalUrl(lesson.sourceUrl))
    .filter((url): url is string => Boolean(url));

  const handleDownload = () => {
    window.open(downloadable[0], "_blank", "noopener,noreferrer");
    if (downloadable.length > 1) {
      toast.success("Opened the first document — the rest are in Curriculum.");
    }
  };

  const firstLesson = course.curriculum[0]?.lessons[0] ?? null;
  const metaLine = `${course.level} · ${course.categoryName}`;
  const hasStarted = course.progressPercent > 0;

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
    <EducationPage surface="muted">
      <CourseActionBar
        backTo="/education"
        isSaved={isSaved}
        onToggleSave={toggleSave}
        onShare={handleShare}
        onDownload={downloadable.length > 0 ? handleDownload : undefined}
        onReport={() =>
          toast.success("Thanks — this course has been reported.")
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
      >
        <CourseDetailHero
          title={course.title}
          coverImageUrl={course.coverImageUrl}
          metaLine={metaLine}
          rating={course.rating}
          reviewCount={course.reviewCount}
          enrolledLabel={
            course.enrolledCount > 0
              ? `${course.enrolledCount.toLocaleString()} enrolled`
              : null
          }
          actionLabel={
            firstLesson
              ? hasStarted
                ? "Continue learning"
                : "Start learning"
              : "Course unavailable"
          }
          showPlayIcon={!hasStarted}
          onAction={() => {
            if (!firstLesson) return;
            navigate(`/education/${course.id}/learn?lesson=${firstLesson.id}`);
          }}
        />

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <div className="mb-3.5 text-[11px] font-bold tracking-[0.08em] text-[#9A9AB0]">
              WHAT&apos;S INCLUDED
            </div>
            <div className="mb-8 flex flex-col gap-3.5">
              {included.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon
                    className="size-5 shrink-0 text-[#9A9AB0]"
                    aria-hidden
                  />
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

            {course.reviews.length > 0 && (
              <div>
                <h3 className="mb-5 text-[19px] font-bold text-[#1A1A2E]">
                  Review
                </h3>
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

          <div className="min-w-0">
            <CourseDetailCurriculum course={course} />
            <CourseRecommendedList
              courses={recommended}
              savedIds={savedRecommendations}
              onToggleSave={toggleRecommendationSave}
            />
          </div>
        </div>
      </motion.div>

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
