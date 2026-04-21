import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Link, useFetcher, useLocation } from "react-router";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { Answer } from "~/services/forum/forum-types";
import { Textarea } from "~/components/ui/textarea";

interface AddAnswerDialogProps {
  questionId?: string;
  isEditing?: boolean;
  isAuthenticated?: boolean;
  data?: Pick<Answer, "id" | "body"> | null;
  trigger?: React.ReactNode;
}

export default function AddAnswerDialog({
  questionId,
  isEditing,
  isAuthenticated = false,
  data,
  trigger,
}: AddAnswerDialogProps) {
  const fetch = useFetcher();
  const location = useLocation();
  const isSubmitting = fetch.state !== "idle";
  const wasSubmitting = useRef(false);
  const [open, setOpen] = useState(false);
  const [bodyError, setBodyError] = useState<string | null>(null);
  const redirectTo = `${location.pathname}${location.search}`;
  const loginHref = `/login?redirectTo=${encodeURIComponent(redirectTo)}`;

  if (!isAuthenticated && !isEditing) {
    if (trigger) {
      return <Link to={loginHref}>{trigger}</Link>;
    }

    return (
      <Link
        to={loginHref}
        className="inline-flex h-9 items-center justify-center rounded-lg border border-[#e2e8f0] px-4 text-sm font-medium text-[#0f172b] shadow-xs"
      >
        Add your answer
      </Link>
    );
  }

  useEffect(() => {
    if (fetch.state === "submitting") {
      wasSubmitting.current = true;
    }

    if (wasSubmitting.current && fetch.state === "idle" && fetch.data) {
      wasSubmitting.current = false;

      const result = fetch.data as
        | { ok?: boolean; message?: string; error?: string }
        | {
            data?: { ok?: boolean };
            message?: string;
            error?: string;
          };

      const isSuccess =
        ("ok" in result && result.ok === true) ||
        ("data" in result && result.data?.ok === true);

      if (isSuccess) {
        setOpen(false);
        setBodyError(null);
        toast.success(
          isEditing
            ? "Answer updated successfully!"
            : "Answer posted successfully!",
        );
      } else {
        toast.error(
          result?.message ?? result?.error ?? "Failed to post answer.",
        );
      }
    }
  }, [fetch.state, fetch.data, isEditing]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const body = String(formData.get("body") ?? "").trim();

    if (!body) {
      event.preventDefault();
      setBodyError("Answer is required.");
      toast.error("Please enter your answer before posting.");
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
      <DialogTrigger>
        {trigger || (
          <Button
            variant="outline"
            className="h-9 rounded-lg border-[#e2e8f0] px-4 text-sm font-medium text-[#0f172b] shadow-xs"
          >
            {isEditing ? "Edit answer" : "Add your answer"}
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
          {isEditing ? "Edit your answer" : "Your answer"}
        </DialogTitle>
        <fetch.Form
          key={isEditing ? `edit-answer-${data?.id ?? "new"}` : "create-answer"}
          method={isEditing ? "patch" : "post"}
          onSubmit={handleSubmit}
        >
          <input
            type="hidden"
            name="actionType"
            value={isEditing ? "update-answer" : "create-answer"}
          />
          <input type="hidden" name="questionId" value={questionId} />
          {isEditing ? (
            <input type="hidden" name="answerId" value={data?.id ?? ""} />
          ) : null}
          <Textarea
            name="body"
            placeholder="Share your experience or provide advice..."
            defaultValue={data?.body ?? ""}
            aria-invalid={Boolean(bodyError)}
            disabled={isSubmitting}
            onChange={(event) => {
              if (event.target.value.trim()) {
                setBodyError(null);
              }
            }}
            className="h-20 w-full rounded-md border border-[#e2e8f0] bg-white px-3 pt-2 text-sm leading-5 text-[#111827] placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-[#2f6fe4]/20 aria-invalid:border-red-500 overflow-x-auto"
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
                "Update answer"
              ) : (
                "Post answer"
              )}
            </Button>
          </div>
        </fetch.Form>
      </DialogContent>
    </Dialog>
  );
}
