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

interface SuspendVolunteerDialogProps {
  opportunityId: string;
  opportunityTitle: string;
  suspended: boolean;
  onSuspend: (opportunityId: string, reason: string) => void;
  onUnsuspend: (opportunityId: string) => void;
  disabled?: boolean;
  withLabel?: boolean;
  className?: string;
}

export default function SuspendVolunteerDialog({
  opportunityId,
  opportunityTitle,
  suspended,
  onSuspend,
  onUnsuspend,
  disabled = false,
  withLabel = false,
  className,
}: SuspendVolunteerDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  const handleConfirm = () => {
    setOpen(false);
    if (suspended) onUnsuspend(opportunityId);
    else onSuspend(opportunityId, reason);
  };

  const actionLabel = suspended ? "Lift suspension" : "Suspend opportunity";
  const ariaLabel = `${actionLabel}: ${opportunityTitle}`;
  const Icon = suspended ? Undo2 : EyeOff;

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
                    "size-8 shrink-0 cursor-pointer rounded-xl bg-white/90 text-slate-500 shadow-sm backdrop-blur transition-colors dark:bg-slate-900/90 dark:text-slate-400",
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
          {suspended ? "Lift this suspension?" : "Suspend this opportunity?"}
        </DialogTitle>
        <DialogDescription className="dark:text-slate-400">
          {suspended
            ? `“${opportunityTitle}” goes back to the status it had before the hold, and its poster is notified that it is public again.`
            : `“${opportunityTitle}” disappears from every listing, search result, and saved list except for its poster, who is notified along with the reason. Nobody can apply to it or save it while it is held, and the poster cannot edit it. Existing applications are left untouched. The hold is reversible.`}
        </DialogDescription>

        {!suspended && (
          <div className="space-y-2">
            <label
              htmlFor={`suspend-reason-${opportunityId}`}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Reason
              <span className="font-normal text-slate-400 dark:text-slate-500">
                {" (optional)"}
              </span>
            </label>
            <Textarea
              id={`suspend-reason-${opportunityId}`}
              value={reason}
              maxLength={REASON_MAX_LENGTH}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Shown to the poster, e.g. misleading roles or spam."
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
