import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import { readActionResult } from "~/lib/action-result";

type ModerationIntent =
  | "deleteQuestion"
  | "deleteAnswer"
  | "suspendQuestion"
  | "unsuspendQuestion"
  | "suspendAnswer"
  | "unsuspendAnswer";

type PendingAction = {
  intent: ModerationIntent;
  id: string;
  label: string;
};

type UseForumModerationOptions = {
  /** Runs after a question delete succeeds (the detail page navigates away). */
  onQuestionDeleted?: (questionId: string) => void;
};

const VERBS: Record<ModerationIntent, { failed: string; done: string }> = {
  deleteQuestion: { failed: "delete", done: "deleted" },
  deleteAnswer: { failed: "delete", done: "deleted" },
  suspendQuestion: { failed: "suspend", done: "suspended" },
  suspendAnswer: { failed: "suspend", done: "suspended" },
  unsuspendQuestion: { failed: "restore", done: "restored" },
  unsuspendAnswer: { failed: "restore", done: "restored" },
};

/**
 * Owns the moderation fetcher for the forum screens.
 *
 * The fetcher deliberately lives on the page rather than inside each dialog: a
 * successful delete revalidates the loader, the deleted row drops out of the
 * list, and the dialog unmounts before its own effect can fire — swallowing the
 * toast. The page outlives every row, so results always land.
 *
 * Suspends need no local bookkeeping: the admin read endpoints return content
 * at any status, so the revalidated loader already reflects the new state.
 */
export function useForumModeration({
  onQuestionDeleted,
}: UseForumModerationOptions = {}) {
  const fetcher = useFetcher();
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const pending = useRef<PendingAction | null>(null);
  const wasSubmitting = useRef(false);

  const resetRemoved = useCallback(() => setRemovedIds(new Set()), []);

  const submit = useCallback(
    (
      intent: ModerationIntent,
      idField: "questionId" | "answerId",
      id: string,
      label: string,
      reason?: string,
    ) => {
      pending.current = { intent, id, label };
      fetcher.submit(
        { intent, [idField]: id, ...(reason === undefined ? {} : { reason }) },
        { method: "post" },
      );
    },
    [fetcher],
  );

  const deleteQuestion = useCallback(
    (questionId: string) =>
      submit("deleteQuestion", "questionId", questionId, "question"),
    [submit],
  );

  const deleteAnswer = useCallback(
    (answerId: string, isReply = false) =>
      submit(
        "deleteAnswer",
        "answerId",
        answerId,
        isReply ? "reply" : "answer",
      ),
    [submit],
  );

  const suspendQuestion = useCallback(
    (questionId: string, reason: string) =>
      submit(
        "suspendQuestion",
        "questionId",
        questionId,
        "question",
        reason.trim(),
      ),
    [submit],
  );

  const unsuspendQuestion = useCallback(
    (questionId: string) =>
      submit("unsuspendQuestion", "questionId", questionId, "question"),
    [submit],
  );

  const suspendAnswer = useCallback(
    (answerId: string, reason: string, isReply = false) =>
      submit(
        "suspendAnswer",
        "answerId",
        answerId,
        isReply ? "reply" : "answer",
        reason.trim(),
      ),
    [submit],
  );

  const unsuspendAnswer = useCallback(
    (answerId: string, isReply = false) =>
      submit(
        "unsuspendAnswer",
        "answerId",
        answerId,
        isReply ? "reply" : "answer",
      ),
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
    const label = target?.label ?? "post";
    const verbs = target ? VERBS[target.intent] : VERBS.deleteQuestion;

    if (!ok) {
      toast.error(message ?? `Failed to ${verbs.failed} the ${label}.`);
      return;
    }

    toast.success(
      message ?? `${label[0].toUpperCase()}${label.slice(1)} ${verbs.done}.`,
    );

    if (!target) return;

    if (
      target.intent === "deleteQuestion" ||
      target.intent === "deleteAnswer"
    ) {
      // Deleted rows linger in already-fetched pages (and in nested reply
      // lists) until the next full load, so track them and filter on render.
      setRemovedIds((prev) => new Set(prev).add(target.id));

      if (target.intent === "deleteQuestion") {
        onQuestionDeleted?.(target.id);
      }
    }
  }, [fetcher.state, fetcher.data, onQuestionDeleted]);

  return {
    removedIds,
    resetRemoved,
    deleteQuestion,
    deleteAnswer,
    suspendQuestion,
    unsuspendQuestion,
    suspendAnswer,
    unsuspendAnswer,
    /** True while any moderation submission is in flight. */
    isDeleting: fetcher.state !== "idle",
  };
}
