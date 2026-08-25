import { useMemo, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { EducationPage } from "../components/education-page";
import { ChapterList } from "../components/chapter-list";
import { CourseActionBar } from "../components/course-action-bar";
import { CourseProgressCard } from "../components/course-progress-card";
import { InstructorCard } from "../components/instructor-card";
import { LessonNotes } from "../components/lesson-notes";
import { LessonPlayer } from "../components/lesson-player";
import { educationLearnLoader } from "../services/education-learn.loader";
import type { CourseLesson } from "../types";
import type { Route } from "./+types/education.learn.$id";

export const loader = educationLearnLoader;

export function meta({ data }: Route.MetaArgs) {
  const lesson = data?.activeLesson.title;
  const course = data?.course.title ?? "Course";
  return [{ title: lesson ? `${lesson} · ${course}` : course }];
}

export default function CourseLearnPage() {
  const { course, activeLesson } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const duration = prefersReducedMotion ? 0 : 0.35;

  const flatLessons = useMemo(
    () => course.curriculum.flatMap((section) => section.lessons),
    [course.curriculum],
  );

  // Lesson progress is not persisted by the API yet, so completion is seeded
  // from the loader and tracked in the page for the rest of the session.
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(
    () => new Set(flatLessons.filter((l) => l.isComplete).map((l) => l.id)),
  );
  const [isSaved, setIsSaved] = useState(course.isSaved);
  const [openSectionIds, setOpenSectionIds] = useState<Set<string>>(
    () => new Set([activeLesson.sectionId]),
  );

  const currentIndex = flatLessons.findIndex(
    (lesson) => lesson.id === activeLesson.id,
  );
  const previousLesson = flatLessons[currentIndex - 1];
  const nextLesson = flatLessons[currentIndex + 1];

  const isComplete = completedLessonIds.has(activeLesson.id);
  const allComplete = completedLessonIds.size === flatLessons.length;

  const goToLesson = (lesson: CourseLesson | undefined) => {
    if (!lesson) return;
    navigate(`/education/${course.id}/learn?lesson=${lesson.id}`);
  };

  const toggleComplete = () => {
    setCompletedLessonIds((current) => {
      const next = new Set(current);
      if (next.has(activeLesson.id)) {
        next.delete(activeLesson.id);
      } else {
        next.add(activeLesson.id);
        if (next.size === flatLessons.length) {
          toast.success("Every chapter done — the final quiz is unlocked.");
        }
      }
      return next;
    });
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <EducationPage surface="muted">
      <CourseActionBar
        className="mb-[18px]"
        backTo={`/education/${course.id}`}
        isSaved={isSaved}
        onToggleSave={() => setIsSaved((value) => !value)}
        onShare={handleShare}
        onReport={() =>
          toast.success("Thanks — this course has been reported.")
        }
      />

      <div className="mb-5.5">
        <h1 className="text-2xl leading-tight font-bold text-[#1A1A2E]">
          {activeLesson.heading}
        </h1>
        <p className="mt-1 text-sm text-[#9A9AB0]">
          {activeLesson.sectionTitle} · Chapter {activeLesson.index} of{" "}
          {flatLessons.length}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration }}
        className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px]"
      >
        <div className="min-w-0">
          <LessonPlayer lesson={activeLesson} />
          <LessonNotes
            lesson={activeLesson}
            courseId={course.id}
            isComplete={isComplete}
            onToggleComplete={toggleComplete}
            onPrevious={() => goToLesson(previousLesson)}
            onNext={() => goToLesson(nextLesson)}
            hasPrevious={Boolean(previousLesson)}
            hasNext={Boolean(nextLesson)}
            showQuizButton={allComplete}
            showCertificateButton={allComplete}
          />
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
          <CourseProgressCard
            completedCount={completedLessonIds.size}
            totalCount={flatLessons.length}
          />
          <ChapterList
            course={course}
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
            lessonIndex={(lesson) =>
              flatLessons.findIndex((l) => l.id === lesson.id) + 1
            }
            quizUnlocked={allComplete}
          />
          <InstructorCard instructor={course.instructor} />
        </aside>
      </motion.div>
    </EducationPage>
  );
}
