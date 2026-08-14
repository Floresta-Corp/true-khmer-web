import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";

import { readActionResult } from "~/lib/action-result";

type ModerationIntent =
  | "deleteLaunchpad"
  | "suspendLaunchpad"
  | "unsuspendLaunchpad";

type UseLaunchpadModerationOptions = {
  onDeleted?: (launchpadId: string) => void;
};

const VERBS: Record<ModerationIntent, { failed: string; done: string }> = {
  deleteLaunchpad: { failed: "delete", done: "deleted" },
  suspendLaunchpad: { failed: "suspend", done: "suspended" },
  unsuspendLaunchpad: { failed: "restore", done: "restored" },
};

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

    setRemovedIds((prev) => new Set(prev).add(target.id));
    onDeleted?.(target.id);
  }, [fetcher.state, fetcher.data, onDeleted]);

  return {
    removedIds,
    resetRemoved,
    deleteProject,
    suspendProject,
    unsuspendProject,
    isModerating: fetcher.state !== "idle",
  };
}
