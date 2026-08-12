import { CheckCircle2, EyeOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { formatMinutesOrHoursAgo } from "~/lib/time";
import { cn } from "~/lib/utils";

type NoticeVariant = "suspended" | "restored";

const VARIANT_STYLES: Record<
  NoticeVariant,
  { chip: string; icon: string; button: string }
> = {
  suspended: {
    chip: "bg-orange-50",
    icon: "text-orange-600",
    button: "bg-orange-600 hover:bg-orange-700",
  },
  restored: {
    chip: "bg-emerald-50",
    icon: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
};

interface SuspensionNoticeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: NoticeVariant;
  noun?: string;
  reason?: string | null;
  suspendedAt?: string | null;
}

export default function SuspensionNoticeDialog({
  open,
  onOpenChange,
  variant = "suspended",
  noun = "question",
  reason,
  suspendedAt,
}: SuspensionNoticeDialogProps) {
  const isRestored = variant === "restored";
  const styles = VARIANT_STYLES[variant];
  const Icon = isRestored ? CheckCircle2 : EyeOff;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-1.5rem)] max-w-100 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-lg sm:p-6"
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              styles.chip,
            )}
          >
            <Icon className={cn("h-[17.5px] w-[17.5px]", styles.icon)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-lg leading-7 font-semibold text-[#030213]">
              {isRestored
                ? `Your ${noun} is public again`
                : `Your ${noun} is on hold`}
            </DialogTitle>
            <p className="text-sm leading-5 font-normal text-[#6a7282]">
              {isRestored ? (
                <>
                  A moderator lifted the hold. It is back in listings and search
                  and everyone can see it again — no action needed from you.
                </>
              ) : (
                <>
                  A moderator suspended it
                  {suspendedAt
                    ? ` ${formatMinutesOrHoursAgo(suspendedAt)}`
                    : ""}
                  . Only you can see it for now — it is hidden from listings,
                  search, and everyone else. This can be lifted.
                </>
              )}
            </p>
          </div>
        </div>

        {!isRestored && (
          <div className="mt-2 rounded-lg bg-orange-50 px-3 py-2.5">
            <p className="text-xs font-semibold text-orange-700">Reason</p>
            <p className="mt-0.5 text-sm leading-5 whitespace-pre-line text-orange-900/90">
              {reason?.trim() ? reason : "No reason was given."}
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn(
              "h-9 rounded-lg px-4 text-sm font-medium text-white sm:h-8",
              styles.button,
            )}
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
