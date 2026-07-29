import { useEffect, useState } from "react";
import { ShieldCheck, EyeOff, type LucideIcon, XCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { NOTE_MAX_LENGTH } from "../utils";

interface ConfirmationModalProps {
  action: "dismiss" | "hide" | null;
  onConfirm: (note?: string) => void;
  onCancel: () => void;
}

interface ActionConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  iconWrap: string;
  confirmClass: string;
}

const CONFIG: Record<"dismiss" | "hide", ActionConfig> = {
  hide: {
    icon: EyeOff,
    title: "Agree & Hide Content?",
    description:
      "This will hide the reported content from the feed. This action cannot be undone.",
    iconWrap:
      "bg-rose-100 text-rose-600 ring-1 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:ring-rose-500/20",
    confirmClass:
      "bg-rose-600 text-white hover:bg-rose-700  shadow-rose-600/20 dark:shadow-rose-950/40",
  },
  dismiss: {
    icon: XCircle,
    title: "Dismiss This Report?",
    description:
      "This will dismiss the report with no action taken. This action cannot be undone.",
    iconWrap:
      "bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/20",
    confirmClass:
      "bg-emerald-600 text-white hover:bg-emerald-700  shadow-emerald-600/20 dark:shadow-emerald-950/40",
  },
};

export function ConfirmationModal({
  action,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const open = action !== null;

  const [lastAction, setLastAction] = useState<"dismiss" | "hide">("dismiss");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (action) {
      setLastAction(action);
      setNote("");
    }
  }, [action]);

  const {
    icon: Icon,
    title,
    description,
    iconWrap,
    confirmClass,
  } = CONFIG[lastAction];

  const handleConfirm = () => {
    const trimmed = note.trim();
    onConfirm(trimmed === "" ? undefined : trimmed);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <DialogContent className="z-80 sm:max-w-md dark:bg-slate-900 dark:ring-slate-800">
        <DialogHeader>
          <div
            className={`mb-2 flex h-12 w-12 items-center justify-center rounded-xl ${iconWrap}`}
          >
            <Icon size={22} strokeWidth={2.25} />
          </div>
          <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed font-medium text-slate-600 dark:text-slate-300">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Optional note */}
        <div className="mt-2">
          <label
            htmlFor="moderation-note"
            className="mb-2 block text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
          >
            Notes (Optional)
          </label>
          <textarea
            id="moderation-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={NOTE_MAX_LENGTH}
            placeholder="Add context for this decision..."
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:ring-slate-700"
          />
        </div>

        <DialogFooter className="dark:border-slate-800 dark:bg-slate-950/50">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="cursor-pointer text-xs font-medium tracking-widest uppercase dark:border-slate-700 dark:bg-slate-950/50 dark:text-white dark:hover:bg-slate-800/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={`cursor-pointer text-xs font-medium tracking-widest uppercase transition-colors ${confirmClass}`}
            >
              Confirm Decision
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
