import { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { getSafeExternalUrl } from "~/lib/utils";
import { EducationPage } from "../education-page";
import { CourseActionBar } from "../course-action-bar";
import { CourseAboutPanel } from "../course-about-panel";
import { CourseDetailCurriculum } from "../course-detail-curriculum";
import { CourseDetailHero } from "../course-detail-hero";
import { CourseRecommendedList } from "../course-recommended-list";
import { useCourseSaves } from "~/features/education/hooks/use-course-saves";
import type { educationDetailLoader } from "~/features/education/services/education-detail.loader";

export default function CourseDetailPage() {
  const { course, recommended } = useLoaderData<typeof educationDetailLoader>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const [isSaved, setIsSaved] = useState(course.isSaved);
  const {
    savedCourseIds: savedRecommendations,
    toggleSave: toggleRecommendationSave,
  } = useCourseSaves(recommended);

  const saveFetcher = useFetcher<{ ok: boolean; error?: string }>();
  const attempted = useRef<boolean | null>(null);
  const announced = useRef<unknown>(null);

  const isSavePending = saveFetcher.state !== "idle";

  const toggleSave = () => {
    if (isSavePending) return;

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

  return (
    <EducationPage>
      <CourseActionBar
        backTo="/education"
        isSaved={isSaved}
        isSavePending={isSavePending}
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
            <CourseAboutPanel course={course} />
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
    </EducationPage>
  );
}
