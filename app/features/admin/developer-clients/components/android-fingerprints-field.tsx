import { useState } from "react";
import { Fingerprint, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  MAX_ANDROID_FINGERPRINTS,
  normalizeSha1Fingerprint,
} from "../lib/android-fingerprints";
import { FieldHint, FieldLabel } from "./form-field";

export function AndroidFingerprintsField({
  fingerprints,
  onChange,
  disabled = false,
}: {
  fingerprints: string[];
  onChange: (fingerprints: string[]) => void;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isFull = fingerprints.length >= MAX_ANDROID_FINGERPRINTS;

  function addFingerprint() {
    if (!draft.trim()) return;
    const normalized = normalizeSha1Fingerprint(draft);
    if (!normalized) {
      setError("Enter a 40-character SHA-1 signing-certificate fingerprint.");
      return;
    }
    if (fingerprints.includes(normalized)) {
      setError("That fingerprint is already registered.");
      setDraft("");
      return;
    }
    if (isFull) {
      setError(`At most ${MAX_ANDROID_FINGERPRINTS} fingerprints.`);
      return;
    }
    setError(null);
    setDraft("");
    onChange([...fingerprints, normalized]);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <FieldLabel htmlFor="android-sha1-input" className="mb-0" required>
          Signing certificate SHA-1
        </FieldLabel>
        <span className="text-xs font-medium text-slate-400 tabular-nums dark:text-slate-500">
          {fingerprints.length}/{MAX_ANDROID_FINGERPRINTS}
        </span>
      </div>
      <div
        className={`flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border bg-transparent p-2 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-slate-950/50 ${
          error
            ? "border-rose-300 dark:border-rose-900"
            : "border-input dark:border-slate-700"
        }`}
      >
        {fingerprints.map((fingerprint) => (
          <span
            key={fingerprint}
            className="flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1 pr-1 pl-2 font-mono text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
          >
            <Fingerprint className="size-3 shrink-0 text-slate-400" />
            <span className="truncate">{fingerprint}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={disabled}
              aria-label={`Remove ${fingerprint}`}
              onClick={() =>
                onChange(fingerprints.filter((entry) => entry !== fingerprint))
              }
              className="shrink-0 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
            >
              <X className="size-3" />
            </Button>
          </span>
        ))}
        <Input
          id="android-sha1-input"
          value={draft}
          disabled={disabled || isFull}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addFingerprint();
            }
          }}
          onBlur={addFingerprint}
          placeholder="AA:BB:CC:..."
          className="h-7 min-w-40 flex-1 border-0 bg-transparent px-1.5 font-mono text-xs shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
        />
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : (
        <FieldHint>
          Register every certificate that signs the app: local debug, release,
          EAS, and Google Play App Signing as applicable.
        </FieldHint>
      )}
    </div>
  );
}
