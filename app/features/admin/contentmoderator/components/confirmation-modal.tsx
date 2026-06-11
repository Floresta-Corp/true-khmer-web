import { memo } from "react";
import { motion } from "motion/react";
import { ShieldCheck, EyeOff } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ConfirmationModalProps {
  action: "dismiss" | "hide";
  onConfirm: () => void;
  onCancel: () => void;
}

// ── ConfirmationModal ──────────────────────────────────────────────────────
// Full-screen overlay shown inside the drawer to double-confirm an action.

export const ConfirmationModal = memo(function ConfirmationModal({
  action,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const isHide = action === "hide";
  const buttonVariant = isHide ? "destructive" : "default";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-(--admin-card-bg)/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center"
      style={{ zIndex: 80 }}
    >
      {/* Icon */}
      <div
        className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${
          isHide
            ? "bg-rose-500/10 text-rose-500"
            : "bg-emerald-500/10 text-emerald-500"
        }`}
      >
        {isHide ? <EyeOff size={40} /> : <ShieldCheck size={40} />}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-black tracking-tight text-(--admin-text) mb-2">
        {isHide ? "Agree & Hide Content?" : "Dismiss This Report?"}
      </h3>

      {/* Description */}
      <p className="text-(--admin-text-muted) font-medium mb-10 max-w-xs text-sm leading-relaxed">
        {isHide
          ? "This action will permanently hide the content from the public feed and record a violation against the author."
          : "This action will mark the report as safe, keeping the content live and closing the investigation."}
      </p>

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        <Button
          onClick={onConfirm}
          variant={buttonVariant}
          className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
        >
          Confirm Decision
        </Button>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full py-4 text-(--admin-text-secondary) font-black text-xs uppercase tracking-widest hover:text-(--admin-text) transition-all"
        >
          Cancel
        </Button>
      </div>
    </motion.div>
  );
});
