import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import type { CourseSummary } from "~/features/education/types";

interface PendingToggle {
  courseId: string;
  saved: boolean;
}

/**
 * The bookmark on a class card, backed by the real save list.
 *
 * Every listing used to keep its own local `Set` that started empty and was
 * thrown away on reload, so the bookmark was decoration. The set is now seeded
 * from what the loader reports as saved and each toggle writes through the
 * `/my-classes` action, which is also what the My Classes screen submits to.
 *
 * The toggle is optimistic — the icon fills on click rather than after the
 * round trip — and rolls the one course back if the write fails.
 */
export function useCourseSaves(courses: CourseSummary[]) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [savedCourseIds, setSavedCourseIds] = useState<Set<string>>(new Set());
  const pending = useRef<PendingToggle | null>(null);
  const announced = useRef<unknown>(null);

  /* Additive on purpose: a revalidation that brings a fresh page of courses
     must not drop the saves the viewer just made on an earlier page. */
  useEffect(() => {
    setSavedCourseIds((current) => {
      const next = new Set(current);
      for (const course of courses) if (course.isSaved) next.add(course.id);
      return next;
    });
  }, [courses]);

  const toggleSave = useCallback(
    (courseId: string) => {
      const saved = !savedCourseIds.has(courseId);

      setSavedCourseIds((current) => {
        const next = new Set(current);
        if (saved) next.add(courseId);
        else next.delete(courseId);
        return next;
      });

      pending.current = { courseId, saved };
      fetcher.submit(
        { intent: saved ? "save" : "unsave", courseId },
        { method: "post", action: "/my-classes" },
      );
    },
    [savedCourseIds, fetcher],
  );

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (announced.current === fetcher.data) return;
    announced.current = fetcher.data;

    const attempt = pending.current;
    pending.current = null;
    if (!attempt) return;

    if (fetcher.data.ok) {
      toast.success(
        attempt.saved ? "Saved to your list." : "Removed from saved.",
      );
      return;
    }

    setSavedCourseIds((current) => {
      const next = new Set(current);
      if (attempt.saved) next.delete(attempt.courseId);
      else next.add(attempt.courseId);
      return next;
    });
    toast.error(fetcher.data.error ?? "That change could not be saved.");
  }, [fetcher.state, fetcher.data]);

  return { savedCourseIds, toggleSave, isSaving: fetcher.state !== "idle" };
}
