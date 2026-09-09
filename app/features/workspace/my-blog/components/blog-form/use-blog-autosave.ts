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

    const timeout = window.setTimeout(async () => {
      window.localStorage.setItem(
        `${BLOG_AUTOSAVE_STORAGE_PREFIX}${draftKey}`,
        serialized,
      );

      try {
        const formData = buildFormDataRef.current();
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

        // A newer edit already started saving; its result is the current one.
        if (revision !== revisionRef.current) return;

        lastSavedPayloadRef.current = serialized;
        if (result.postId && !currentPostIdRef.current) {
          currentPostIdRef.current = String(result.postId);
        }

        setAutosaveStatus("saved");
        setAutosaveLabel(
          savedAtLabel(
            "Saved",
            result.updatedAt ? new Date(String(result.updatedAt)) : new Date(),
          ),
        );

        if (result.redirectTo && !postId) {
          window.localStorage.removeItem(
            `${BLOG_AUTOSAVE_STORAGE_PREFIX}${draftKey}`,
          );
          navigate(String(result.redirectTo), { replace: true });
        }
      } catch (error) {
        if (revision !== revisionRef.current) return;
        console.error("Blog autosave fell back to local storage", error);
        setAutosaveStatus("error");
        setAutosaveLabel(savedAtLabel("Saved locally", new Date()));
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [draftKey, enabled, navigate, postId, serialized]);

  return {
    autosaveStatus,
    autosaveLabel,
    setAutosaveStatus,
    setAutosaveLabel,
    /**
     * The server id of the draft, which autosave may have created after this
     * component mounted on `/workspace/khmer-voices/new`.
     */
    savedPostIdRef: currentPostIdRef,
  };
}
