import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import { readActionResult } from "~/lib/action-result";

type ModerationIntent =
  | "deleteVolunteer"
  | "suspendVolunteer"
  | "unsuspendVolunteer";

type UseVolunteerModerationOptions = {
  onDeleted?: (opportunityId: string) => void;
};

const VERBS: Record<ModerationIntent, { failed: string; done: string }> = {
  deleteVolunteer: { failed: "delete", done: "deleted" },
  suspendVolunteer: { failed: "suspend", done: "suspended" },
  unsuspendVolunteer: { failed: "restore", done: "restored" },
};

export function useVolunteerModeration({
  onDeleted,
}: UseVolunteerModerationOptions = {}) {
  const fetcher = useFetcher();
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const pending = useRef<{ intent: ModerationIntent; id: string } | null>(null);
  const wasSubmitting = useRef(false);

  const resetRemoved = useCallback(() => setRemovedIds(new Set()), []);

  const submit = useCallback(
    (intent: ModerationIntent, opportunityId: string, reason?: string) => {
      pending.current = { intent, id: opportunityId };
      fetcher.submit(
        {
          intent,
          opportunityId,
          ...(reason === undefined ? {} : { reason }),
        },
        { method: "post" },
      );
    },
    [fetcher],
  );

  const deleteOpportunity = useCallback(
    (opportunityId: string) => submit("deleteVolunteer", opportunityId),
    [submit],
  );

  const suspendOpportunity = useCallback(
    (opportunityId: string, reason: string) =>
      submit("suspendVolunteer", opportunityId, reason.trim()),
    [submit],
  );

  const unsuspendOpportunity = useCallback(
    (opportunityId: string) => submit("unsuspendVolunteer", opportunityId),
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
    const verbs = target ? VERBS[target.intent] : VERBS.deleteVolunteer;

    if (!ok) {
      toast.error(message ?? `Failed to ${verbs.failed} the opportunity.`);
      return;
    }

    toast.success(message ?? `Opportunity ${verbs.done}.`);

    if (!target || target.intent !== "deleteVolunteer") return;

    setRemovedIds((prev) => new Set(prev).add(target.id));
    onDeleted?.(target.id);
  }, [fetcher.state, fetcher.data, onDeleted]);

  return {
    removedIds,
    resetRemoved,
    deleteOpportunity,
    suspendOpportunity,
    unsuspendOpportunity,
    isModerating: fetcher.state !== "idle",
  };
}
