import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { AutosaveStatusValue } from "~/components/autosave-status";
import { BLOG_AUTOSAVE_STORAGE_PREFIX } from "../../types";

const AUTOSAVE_DEBOUNCE_MS = 900;

const MEANINGFUL_FIELDS = ["title", "excerpt", "content", "coverImageUrl"];

function savedAtLabel(prefix: string, savedAt: Date) {
  return `${prefix} · ${savedAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

interface UseBlogAutosaveOptions {
  /** Serializable draft fields; a change here schedules the next autosave. */
  payload: Record<string, unknown>;
  buildFormData: () => FormData;
  draftKey: string;
  postId?: string;
  /** `updatedAt` of the loaded post, shown before the first autosave. */
  savedAt?: string;
  /** Frozen posts (in review, published) are never autosaved. */
  enabled: boolean;
}

export function useBlogAutosave({
  payload,
  buildFormData,
  draftKey,
  postId,
  savedAt,
  enabled,
}: UseBlogAutosaveOptions) {
  const navigate = useNavigate();
  const serialized = JSON.stringify(payload);

  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatusValue>(
    postId ? "saved" : "ready",
  );
  const [autosaveLabel, setAutosaveLabel] = useState(() =>
    postId && savedAt
      ? savedAtLabel("Saved", new Date(savedAt))
      : "Autosave ready",
  );
  // A loaded post is already saved as it stands, so the first edit — not the
  // first render — is what schedules an autosave.
  const lastSavedPayloadRef = useRef<string | null>(postId ? serialized : null);
  const currentPostIdRef = useRef<string | undefined>(postId);
  const revisionRef = useRef(0);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingRedirectRef = useRef<string | null>(null);
  const buildFormDataRef = useRef(buildFormData);
  buildFormDataRef.current = buildFormData;

  useEffect(() => {
    if (!enabled) return;

    // Nothing new to persist. Checked before the label changes so a revert to
    // the last saved draft cannot leave "Saving draft..." on screen.
    if (serialized === lastSavedPayloadRef.current) return;

    const draft = JSON.parse(serialized) as Record<string, unknown>;
    const hasMeaningfulDraft = MEANINGFUL_FIELDS.map((key) => draft[key]).some(
      (value) => typeof value === "string" && value.trim(),
    );

    if (!currentPostIdRef.current && !hasMeaningfulDraft) {
      lastSavedPayloadRef.current = serialized;
      setAutosaveStatus("ready");
      setAutosaveLabel("Autosave ready");
      return;
    }

    const revision = ++revisionRef.current;
    setAutosaveStatus("saving");
    setAutosaveLabel("Saving draft...");

    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(
        `${BLOG_AUTOSAVE_STORAGE_PREFIX}${draftKey}`,
        serialized,
      );

      // Capture this revision's fields now. The queued request may not start
      // until an earlier save completes and the live form may have changed by
      // then.
      const formData = buildFormDataRef.current();

      const saveRevision = async () => {
        if (currentPostIdRef.current) {
          formData.set("postId", currentPostIdRef.current);
        }

        const response = await fetch("/api/blog/autosave", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (!response.ok || !result?.ok) {
          throw new Error(result?.error || "Autosave failed");
        }

        // This must happen before the next queued save starts, even when a
        // newer revision exists. It turns every later request into an update
        // instead of allowing another create.
        if (result.postId && !currentPostIdRef.current) {
          currentPostIdRef.current = String(result.postId);
        }
        if (result.redirectTo) {
          pendingRedirectRef.current = String(result.redirectTo);
        }

        // A newer edit is queued; let that revision own the visible status and
        // navigate only after it has also reached the server.
        if (revision !== revisionRef.current) return;

        lastSavedPayloadRef.current = serialized;

        setAutosaveStatus("saved");
        setAutosaveLabel(
          savedAtLabel(
            "Saved",
            result.updatedAt ? new Date(String(result.updatedAt)) : new Date(),
          ),
        );

        if (pendingRedirectRef.current && !postId) {
          window.localStorage.removeItem(
            `${BLOG_AUTOSAVE_STORAGE_PREFIX}${draftKey}`,
          );
          navigate(pendingRedirectRef.current, { replace: true });
        }
      };

      const queuedSave = saveQueueRef.current
        .catch(() => undefined)
        .then(saveRevision);
      saveQueueRef.current = queuedSave;

      void queuedSave.catch((error: unknown) => {
        if (revision !== revisionRef.current) return;
        console.error("Blog autosave fell back to local storage", error);
        setAutosaveStatus("error");
        setAutosaveLabel(savedAtLabel("Saved locally", new Date()));
      });
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [draftKey, enabled, navigate, postId, serialized]);

  return {
    autosaveStatus,
    autosaveLabel,
    isAutosaving: autosaveStatus === "saving",
    /**
     * The server id of the draft, which autosave may have created after this
     * component mounted on `/workspace/khmer-voices/new`.
     */
    savedPostIdRef: currentPostIdRef,
  };
}
