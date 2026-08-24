import { useEffect, useRef, useState } from "react";
import { ImageIcon, Trash2, Upload } from "lucide-react";

import { Button } from "~/components/ui/button";
import { resolveImageURL } from "~/lib/utils";
import {
  LOGO_ACCEPT_ATTRIBUTE,
  formatFileSize,
  validateLogoFile,
} from "../lib/logo";
import { FieldHint, FieldLabel } from "./form-field";

interface LogoUploadFieldProps {
  /** The logo already stored on the client, if any. */
  existingKey: string;
  /** A newly picked file that has not been uploaded yet. */
  file: File | null;
  disabled?: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

export function LogoUploadField({
  existingKey,
  file,
  disabled = false,
  onSelect,
  onRemove,
}: LogoUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Object URLs must be revoked, so they are owned by this effect.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const storedUrl = existingKey ? resolveImageURL(existingKey) : "";
  const shownUrl = previewUrl ?? storedUrl;
  const hasLogo = shownUrl !== "";

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    // Allow re-picking the same file after a removal.
    event.target.value = "";
    if (!selected) return;

    const message = validateLogoFile(selected);
    if (message) {
      setError(message);
      return;
    }

    setError(null);
    onSelect(selected);
  }

  function handleRemove() {
    setError(null);
    onRemove();
  }

  return (
    <div>
      <FieldLabel htmlFor="client-logo">Logo</FieldLabel>

      <div className="flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-3 dark:border-slate-700 dark:bg-slate-950/40">
        <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          {hasLogo ? (
            <img
              src={shownUrl}
              alt=""
              className="size-full object-contain p-1"
            />
          ) : (
            <ImageIcon className="size-5 text-slate-300 dark:text-slate-600" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
            {file ? file.name : hasLogo ? "Current logo" : "No logo uploaded"}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {file
              ? `${formatFileSize(file.size)} — uploads when you save`
              : "PNG, JPEG, WebP, or SVG. Up to 5 MB."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="h-9 rounded-lg font-medium dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-800/50"
          >
            <Upload className="size-3.5" />
            {hasLogo ? "Replace" : "Upload"}
          </Button>
          {hasLogo && (
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              disabled={disabled}
              aria-label="Remove logo"
              onClick={handleRemove}
              className="rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
            >
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <input
        id="client-logo"
        ref={inputRef}
        type="file"
        accept={LOGO_ACCEPT_ATTRIBUTE}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
      />

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          {error}
        </p>
      ) : (
        <FieldHint>
          Displayed beside the name on the partner's login page. A square image
          reads best.
        </FieldHint>
      )}
    </div>
  );
}
