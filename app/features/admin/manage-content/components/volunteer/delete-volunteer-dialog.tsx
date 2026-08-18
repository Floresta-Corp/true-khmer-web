import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface DeleteVolunteerDialogProps {
  opportunityId: string;
  opportunityTitle: string;
  applicationCount?: number;
  onConfirm: (opportunityId: string) => void;
  disabled?: boolean;
  withLabel?: boolean;
  className?: string;
}

export default function DeleteVolunteerDialog({
  opportunityId,
  opportunityTitle,
  applicationCount = 0,
  onConfirm,
  disabled = false,
  withLabel = false,
  className,
}: DeleteVolunteerDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm(opportunityId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {withLabel ? (
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            disabled={disabled}
            className="h-auto cursor-pointer gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:bg-slate-900 dark:hover:bg-red-500/10"
            aria-label={`Delete opportunity: ${opportunityTitle}`}
          >
            <Trash2 size={14} />
            Delete opportunity
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
                    "size-8 shrink-0 cursor-pointer rounded-xl bg-white/90 text-slate-500 shadow-sm backdrop-blur transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400",
                    className,
                  )}
                  aria-label={`Delete opportunity: ${opportunityTitle}`}
                >
                  <Trash2 size={14} />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Delete opportunity</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DialogContent className="max-w-sm rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/40">
        <DialogTitle>Delete this opportunity?</DialogTitle>
        <DialogDescription className="dark:text-slate-400">
          &ldquo;{opportunityTitle}&rdquo; will be removed from the volunteer
          listings and its detail page.
          {applicationCount > 0
            ? ` Its ${applicationCount} existing application${applicationCount === 1 ? "" : "s"} will be left untouched.`
            : " Existing applications are left untouched."}
        </DialogDescription>

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
            className="bg-red-600 text-white hover:bg-red-700 dark:hover:bg-red-500"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
