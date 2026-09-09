import { useState } from "react";
import { X } from "lucide-react";
import { Link, useFetcher, useLocation, useRevalidator } from "react-router";
import { toast } from "sonner";
import { useFetcherOutcome } from "~/hooks/use-fetcher-outcome";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";

export interface CommentFormDialogProps {
  /** Noun used across the copy, e.g. "answer", "comment" or "reply". */
  entityLabel: string;
  /**
   * Hidden inputs the route action needs (action type, parent ids). Entries
   * with an undefined value are skipped.
   */
  fields: Record<string, string | undefined>;
  isEditing?: boolean;
  isAuthenticated?: boolean;
  defaultValue?: string;
  placeholder?: string;
  method?: "post" | "patch";
  /** Resets the form when the edited target changes. */
  formKey?: string;
  trigger?: React.ReactNode;
  onSuccess?: (message?: string) => void;
}

export default function CommentFormDialog({
  entityLabel,
  fields,
  isEditing = false,
  isAuthenticated = false,
  defaultValue = "",
  placeholder = "Share your experience or provide advice...",
  method,
  formKey,
  trigger,
  onSuccess,
}: CommentFormDialogProps) {
  const fetcher = useFetcher();
  const location = useLocation();
  const revalidator = useRevalidator();
  const isSubmitting = fetcher.state !== "idle";
  const [open, setOpen] = useState(false);
  const [bodyError, setBodyError] = useState<string | null>(null);
  const redirectTo = `${location.pathname}${location.search}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;
  const Entity = entityLabel.charAt(0).toUpperCase() + entityLabel.slice(1);

  useFetcherOutcome(fetcher, {
    onSuccess: (message) => {
      setOpen(false);
      setBodyError(null);
      revalidator.revalidate();
      onSuccess?.(message);
      toast.success(
        message ??
          (isEditing
            ? `${Entity} updated successfully.`
            : `${Entity} posted successfully.`),
      );
    },
    onError: (message) =>
      toast.error(message ?? `Failed to post ${entityLabel}.`),
  });

  if (!isAuthenticated && !isEditing) {
    if (trigger) {
      return <Link to={loginHref}>{trigger}</Link>;
    }

    return (
      <Link
        to={loginHref}
        className="inline-flex h-9 items-center justify-center rounded-lg border border-[#e2e8f0] px-4 text-sm font-medium text-[#0f172b] shadow-xs"
      >
        Add your {entityLabel}
      </Link>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const body = String(formData.get("body") ?? "").trim();

    if (!body) {
      event.preventDefault();
      setBodyError(`${Entity} is required.`);
      toast.error(`Please enter your ${entityLabel} before posting.`);
      return;
    }

    setBodyError(null);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setBodyError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            className="h-9 rounded-lg border-[#e2e8f0] px-4 text-sm font-medium text-[#0f172b] shadow-xs"
          >
            {isEditing ? `Edit ${entityLabel}` : `Add your ${entityLabel}`}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="max-w-[calc(100%-1rem)] gap-4 overflow-hidden rounded-2xl border border-[#f1f5f9] bg-white p-6 sm:max-w-201"
      >
        <DialogClose>
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute top-4 right-4 h-4 w-4 rounded-sm p-0 text-[#4a5565]/80 hover:bg-transparent hover:text-[#1f2937]"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogClose>

        <DialogTitle className="text-lg leading-7 font-semibold text-[#111827]">
          {isEditing ? `Edit your ${entityLabel}` : `Your ${entityLabel}`}
        </DialogTitle>
        <fetcher.Form
          key={formKey}
          method={method ?? (isEditing ? "patch" : "post")}
          onSubmit={handleSubmit}
        >
          {Object.entries(fields).map(([name, value]) =>
            value === undefined ? null : (
              <input key={name} type="hidden" name={name} value={value} />
            ),
          )}
          <Textarea
            name="body"
            placeholder={placeholder}
            defaultValue={defaultValue}
            aria-invalid={Boolean(bodyError)}
            disabled={isSubmitting}
            onChange={(event) => {
              if (event.target.value.trim()) {
                setBodyError(null);
              }
            }}
            className="min-h-20 w-full resize-none overflow-x-auto rounded-md border border-[#e2e8f0] bg-white px-3 pt-2 text-sm leading-5 text-[#111827] placeholder:text-black/50 focus:ring-2 focus:ring-[#2f6fe4]/20 focus:outline-none aria-invalid:border-red-500"
          />
          {bodyError ? (
            <p className="mt-1 text-xs text-red-600">{bodyError}</p>
          ) : null}

          <div className="flex w-full justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-8 rounded-lg bg-[#2f6fe4] px-3 text-sm font-medium text-white hover:bg-[#245fca]"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner className="size-3.5" />
                  {isEditing ? "Updating..." : "Posting..."}
                </span>
              ) : isEditing ? (
                `Update ${entityLabel}`
              ) : (
                `Post ${entityLabel}`
              )}
            </Button>
          </div>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
