import { motion } from "motion/react";
import { ShieldCheck, EyeOff, type LucideIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

interface ConfirmationModalProps {
  action: "dismiss" | "hide";
  onConfirm: () => void;
  onCancel: () => void;
}

interface ActionConfig {
  icon: LucideIcon;
  title: string;
  description: string;
  iconWrap: string;
  confirmClass: string;
}

const CONFIG: Record<ConfirmationModalProps["action"], ActionConfig> = {
  hide: {
    icon: EyeOff,
    title: "Agree & Hide Content?",
    description:
      "This action will permanently hide the content from the public feed and record a violation against the author.",
    iconWrap:
      "bg-rose-100 text-rose-600 ring-1 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:ring-rose-500/20",
    confirmClass:
      "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 dark:shadow-rose-950/40",
  },
  dismiss: {
    icon: ShieldCheck,
    title: "Dismiss This Report?",
    description:
      "This action will mark the report as safe, keeping the content live and closing the investigation.",
    iconWrap:
      "bg-emerald-100 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:ring-emerald-500/20",
    confirmClass:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 dark:shadow-emerald-950/40",
  },
};

export function ConfirmationModal({
  action,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const {
    icon: Icon,
    title,
    description,
    iconWrap,
    confirmClass,
  } = CONFIG[action];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl"
      style={{ zIndex: 80 }}
    >
      {/* Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${iconWrap}`}
      >
        <Icon size={36} strokeWidth={2.25} />
      </motion.div>

      {/* Title */}
      <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-xs text-sm leading-relaxed">
        {description}
      </p>

      {/* Actions */}
      <div className="flex flex-col w-full gap-3">
        <Button
          onClick={onConfirm}
          className={`w-full cursor-pointer py-4 font-black text-xs uppercase tracking-widest transition-colors ${confirmClass}`}
        >
          Confirm Decision
        </Button>
        <Button
          variant="ghost"
          onClick={onCancel}
          className="w-full cursor-pointer py-4 font-black text-xs uppercase tracking-widest
            border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900
            dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white
            transition-colors"
        >
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}
