import { useState } from "react";
import { Globe, ShieldAlert, X } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { MAX_ALLOWED_ORIGINS, normalizeOrigin } from "../lib/origins";
import { FieldHint, FieldLabel } from "./form-field";

interface AllowedOriginsFieldProps {
  origins: string[];
  onChange: (origins: string[]) => void;
  allowAllOrigins: boolean;
  onAllowAllOriginsChange: (allowAllOrigins: boolean) => void;
  disabled?: boolean;
}

export function AllowedOriginsField({
  origins,
  onChange,
  allowAllOrigins,
  onAllowAllOriginsChange,
  disabled = false,
}: AllowedOriginsFieldProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const isFull = origins.length >= MAX_ALLOWED_ORIGINS;
  // The list is kept but ignored while every origin is allowed, so turning the
  // option back off restores it.
  const isListDisabled = disabled || allowAllOrigins;

  function addOrigin() {
    const raw = draft.trim();
    if (!raw) return;

    if (isFull) {
      setError(`At most ${MAX_ALLOWED_ORIGINS} origins.`);
      return;
    }

    const normalized = normalizeOrigin(raw);
    if (!normalized) {
      setError("Enter a full http(s) URL, for example https://partner.com");
      return;
    }

    if (origins.includes(normalized)) {
      setError(`${normalized} is already listed.`);
      setDraft("");
      return;
    }

    setError(null);
    setDraft("");
    onChange([...origins, normalized]);
  }

  function removeOrigin(origin: string) {
    setError(null);
    onChange(origins.filter((entry) => entry !== origin));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addOrigin();
      return;
    }

    if (event.key === "Backspace" && draft === "" && origins.length > 0) {
      removeOrigin(origins[origins.length - 1]);
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <FieldLabel htmlFor="client-origin-input" className="mb-0">
          Allowed origins
        </FieldLabel>
        {!allowAllOrigins && (
          <span className="text-xs font-medium text-slate-400 tabular-nums dark:text-slate-500">
            {origins.length}/{MAX_ALLOWED_ORIGINS}
          </span>
        )}
      </div>

      <div
        className={`flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border bg-transparent p-2 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-slate-950/50 ${
          error
            ? "border-rose-300 dark:border-rose-900"
            : "border-input dark:border-slate-700"
        } ${allowAllOrigins ? "opacity-50" : ""}`}
      >
        {origins.map((origin) => (
          <span
            key={origin}
            className="flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 py-1 pr-1 pl-2 font-mono text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200"
          >
            <Globe className="size-3 shrink-0 text-slate-400" />
            <span className="truncate">{origin}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              disabled={isListDisabled}
              aria-label={`Remove ${origin}`}
              onClick={() => removeOrigin(origin)}
              className="shrink-0 text-slate-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/40"
            >
              <X className="size-3" />
            </Button>
          </span>
        ))}

        <Input
          id="client-origin-input"
          value={draft}
          disabled={isListDisabled || isFull}
          onChange={(event) => {
            setDraft(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={addOrigin}
          placeholder={
            allowAllOrigins
              ? "Every origin is allowed"
              : isFull
                ? "Origin limit reached"
                : origins.length === 0
                  ? "https://partner.com"
                  : "Add another origin..."
          }
          className="h-7 min-w-40 flex-1 border-0 bg-transparent px-1.5 text-sm shadow-none focus-visible:border-0 focus-visible:ring-0 dark:bg-transparent"
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : (
        <FieldHint>
          Press Enter to add each origin. Matched exactly — no wildcards or
          subdomains, so list staging and production separately.{" "}
          {origins.length === 0 && !allowAllOrigins && (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              With none listed, the partner cannot start a sign-in.
            </span>
          )}
        </FieldHint>
      )}

      <div
        className={`mt-3 rounded-xl border px-3 py-2.5 transition-colors ${
          allowAllOrigins
            ? "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
            : "border-slate-200 bg-slate-50/60 dark:border-slate-700 dark:bg-slate-950/40"
        }`}
      >
        <div className="flex items-start gap-2.5">
          <Checkbox
            id="client-allow-all-origins"
            checked={allowAllOrigins}
            disabled={disabled}
            onCheckedChange={(checked) => {
              setError(null);
              onAllowAllOriginsChange(checked === true);
            }}
            className="mt-0.5"
          />
          <div className="min-w-0">
            <Label
              htmlFor="client-allow-all-origins"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              Allow all origins
            </Label>
            {allowAllOrigins ? (
              <p className="mt-1 flex items-start gap-1.5 text-xs leading-5 font-semibold text-amber-600 dark:text-amber-400">
                <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  Any website can start a sign-in for this client, and the list
                  above is ignored. Development clients only.
                </span>
              </p>
            ) : (
              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Skip the origin check entirely — for a client a developer is
                still testing locally.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
