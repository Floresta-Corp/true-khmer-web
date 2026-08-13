import { useEffect, useState } from "react";
import { EyeOff, Undo2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

const REASON_MAX_LENGTH = 500;

type PostNoun = "question" | "answer" | "reply";

const SUSPEND_COPY: Record<PostNoun, string> = {
  question:
    "disappears from every listing, search result, and detail page except for its author, who is notified along with the reason",
  answer:
    "is hidden from the thread for everyone but its author, who is notified along with the reason. Its replies stay published but become unreachable while it is held",
  reply:
    "is hidden from the thread for everyone but its author, who is notified along with the reason",
};

interface SuspendForumPostDialogProps {
  postId: string;
  postLabel: string;
  noun: PostNoun;
  suspended: boolean;
  onSuspend: (postId: string, reason: string) => void;
  onUnsuspend: (postId: string) => void;
  disabled?: boolean;
  withLabel?: boolean;
  className?: string;
}

export default function SuspendForumPostDialog({
  postId,
  postLabel,
  noun,
  suspended,
  onSuspend,
  onUnsuspend,
  disabled = false,
  withLabel = false,
  className,
}: SuspendForumPostDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const handleConfirm = () => {
    setOpen(false);
    if (suspended) onUnsuspend(postId);
    else onSuspend(postId, reason);
  };

  const actionLabel = suspended ? "Lift suspension" : `Suspend ${noun}`;
  const ariaLabel = `${actionLabel}: ${postLabel}`;
  const Icon = suspended ? Undo2 : EyeOff;
  const subject =
    noun === "question" ? `“${postLabel}”` : `${postLabel}’s ${noun}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {withLabel ? (
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className={cn(
              "h-auto cursor-pointer gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-semibold dark:bg-slate-900",
              suspended
                ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-emerald-500/30 dark:text-emerald-400 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                : "border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:border-amber-500/30 dark:text-amber-400 dark:hover:bg-amber-500/10 dark:hover:text-amber-300",
              className,
            )}
            aria-label={ariaLabel}
          >
            <Icon size={14} />
            {actionLabel}
          </Button>
        </DialogTrigger>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={disabled}
                  className={cn(
                    "size-8 shrink-0 cursor-pointer rounded-xl bg-[#f9fafb] text-[#99a1af] transition-colors dark:bg-slate-800 dark:text-slate-400",
                    suspended
                      ? "hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                      : "hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400",
                    className,
                  )}
                  aria-label={ariaLabel}
                >
                  <Icon size={14} />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>{actionLabel}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DialogContent className="max-w-sm rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
        <DialogTitle>
          {suspended ? "Lift this suspension?" : `Suspend this ${noun}?`}
        </DialogTitle>
        <DialogDescription className="dark:text-slate-400">
          {suspended
            ? `${subject} goes back to the status it had before the hold, and its author is notified that it is public again.`
            : `${subject} ${SUSPEND_COPY[noun]}. The hold is reversible.`}
        </DialogDescription>

        {!suspended && (
          <div className="space-y-2">
            <label
              htmlFor={`suspend-reason-${postId}`}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Reason
              <span className="font-normal text-slate-400 dark:text-slate-500">
                {" (optional)"}
              </span>
            </label>
            <Textarea
              id={`suspend-reason-${postId}`}
              value={reason}
              maxLength={REASON_MAX_LENGTH}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Shown to the author, e.g. off-topic or spam."
              className="min-h-20 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <p className="text-right text-[11px] text-slate-400 dark:text-slate-500">
              {reason.length}/{REASON_MAX_LENGTH}
            </p>
          </div>
        )}

        <DialogFooter className="dark:border-slate-700 dark:bg-slate-800/40">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleConfirm}
            className={cn(
              "text-white",
              suspended
                ? "bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500"
                : "bg-amber-600 hover:bg-amber-700 dark:hover:bg-amber-500",
            )}
          >
            {suspended ? "Lift suspension" : "Suspend"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
