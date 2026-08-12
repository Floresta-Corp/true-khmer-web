import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import { readActionResult } from "~/lib/action-result";

type ModerationIntent =
  | "deleteLaunchpad"
  | "suspendLaunchpad"
  | "unsuspendLaunchpad";

type UseLaunchpadModerationOptions = {
  /** Runs after a delete succeeds (the detail page navigates away). */
  onDeleted?: (launchpadId: string) => void;
};

const VERBS: Record<ModerationIntent, { failed: string; done: string }> = {
  deleteLaunchpad: { failed: "delete", done: "deleted" },
  suspendLaunchpad: { failed: "suspend", done: "suspended" },
  unsuspendLaunchpad: { failed: "restore", done: "restored" },
};

/**
 * Owns the moderation fetcher for the launchpad screens.
 *
 * The fetcher deliberately lives on the page rather than inside each dialog: a
 * successful delete revalidates the loader, the deleted card drops out of the
 * list, and the dialog unmounts before its own effect can fire — swallowing the
 * toast. The page outlives every card, so results always land.
 *
 * Suspends need no local bookkeeping: the admin read endpoints return projects
 * at any status, so the revalidated loader already reflects the new state.
 */
export function useLaunchpadModeration({
  onDeleted,
}: UseLaunchpadModerationOptions = {}) {
  const fetcher = useFetcher();
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const pending = useRef<{ intent: ModerationIntent; id: string } | null>(null);
  const wasSubmitting = useRef(false);

  const resetRemoved = useCallback(() => setRemovedIds(new Set()), []);

  const submit = useCallback(
    (intent: ModerationIntent, launchpadId: string, reason?: string) => {
      pending.current = { intent, id: launchpadId };
      fetcher.submit(
        {
          intent,
          launchpadId,
          ...(reason === undefined ? {} : { reason }),
        },
        { method: "post" },
      );
    },
    [fetcher],
  );

  const deleteProject = useCallback(
    (launchpadId: string) => submit("deleteLaunchpad", launchpadId),
    [submit],
  );

  const suspendProject = useCallback(
    (launchpadId: string, reason: string) =>
      submit("suspendLaunchpad", launchpadId, reason.trim()),
    [submit],
  );

  const unsuspendProject = useCallback(
    (launchpadId: string) => submit("unsuspendLaunchpad", launchpadId),
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
    const verbs = target ? VERBS[target.intent] : VERBS.deleteLaunchpad;

    if (!ok) {
      toast.error(message ?? `Failed to ${verbs.failed} the project.`);
      return;
    }

    toast.success(message ?? `Project ${verbs.done}.`);

    if (!target || target.intent !== "deleteLaunchpad") return;

    // Deleted cards linger in already-fetched pages until the next full load,
    // so track them and filter on render.
    setRemovedIds((prev) => new Set(prev).add(target.id));
    onDeleted?.(target.id);
  }, [fetcher.state, fetcher.data, onDeleted]);

  return {
    removedIds,
    resetRemoved,
    deleteProject,
    suspendProject,
    unsuspendProject,
    /** True while any moderation submission is in flight. */
    isModerating: fetcher.state !== "idle",
  };
}
