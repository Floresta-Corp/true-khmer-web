import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import type { CourseReviewIntent } from "~/features/admin/manage-education/types";
import { readActionResult } from "~/lib/action-result";
import type { CourseResponse } from "~/types/api-client";

type CourseStatus = CourseResponse["status"];

type UseCourseReviewOptions = {
  onDecided?: (courseId: string, status: CourseStatus) => void;
};

const FAILED_VERB: Record<CourseReviewIntent, string> = {
  approveCourse: "approve",
  rejectCourse: "reject",
  publishCourse: "publish",
  unpublishCourse: "unpublish",
};

export function useCourseReview({ onDecided }: UseCourseReviewOptions = {}) {
  const fetcher = useFetcher();
  const [decidedStatuses, setDecidedStatuses] = useState<
    Map<string, CourseStatus>
  >(new Map());
  const pending = useRef<{ intent: CourseReviewIntent; id: string } | null>(
    null,
  );
  const wasSubmitting = useRef(false);

  const submit = useCallback(
    (intent: CourseReviewIntent, courseId: string, note?: string) => {
      pending.current = { intent, id: courseId };
      fetcher.submit(
        {
          intent,
          courseId,
          ...(note === undefined ? {} : { note }),
        },
        { method: "post" },
      );
    },
    [fetcher],
  );

  const approve = useCallback(
    (courseId: string) => submit("approveCourse", courseId),
    [submit],
  );

  const reject = useCallback(
    (courseId: string, note: string) =>
      submit("rejectCourse", courseId, note.trim()),
    [submit],
  );

  const publish = useCallback(
    (courseId: string) => submit("publishCourse", courseId),
    [submit],
  );

  const unpublish = useCallback(
    (courseId: string) => submit("unpublishCourse", courseId),
    [submit],
  );

  useEffect(() => {
    if (fetcher.state === "submitting") {
      wasSubmitting.current = true;
      return;
    }

    if (!wasSubmitting.current || fetcher.state !== "idle" || !fetcher.data) {
      return;
    }

    wasSubmitting.current = false;
    const target = pending.current;
    pending.current = null;

    const { ok, message } = readActionResult(fetcher.data);

    if (!ok) {
      const verb = target ? FAILED_VERB[target.intent] : "update";
      toast.error(message ?? `Failed to ${verb} the course.`);
      return;
    }

    toast.success(message ?? "Course updated.");

    const status = (fetcher.data as { status?: CourseStatus }).status;
    if (!target || !status) return;

    setDecidedStatuses((prev) => new Map(prev).set(target.id, status));
    onDecided?.(target.id, status);
  }, [fetcher.state, fetcher.data, onDecided]);

  return {
    decidedStatuses,
    approve,
    reject,
    publish,
    unpublish,
    isReviewing: fetcher.state !== "idle",
  };
}
