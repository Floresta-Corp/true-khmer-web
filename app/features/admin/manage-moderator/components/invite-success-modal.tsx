import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "~/components/ui/button";

interface InviteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteSuccessModal({
  isOpen,
  onClose,
}: InviteSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative flex min-h-100 w-full max-w-md flex-col items-center justify-center gap-6 rounded-3xl border border-slate-100 bg-white p-10 dark:border-slate-700/50 dark:bg-slate-800/60"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
              <CheckCircle2
                size={40}
                strokeWidth={1.5}
                className="text-emerald-400"
              />
            </div>

            <div className="space-y-5 text-center">
              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Invitation Sent
              </h3>
              <p className="text-xs leading-relaxed font-semibold tracking-widest text-slate-400 uppercase">
                The member will receive an email shortly
                <br />
                with instructions to join the workspace.
              </p>
            </div>

            <Button
              onClick={onClose}
              className="mt-5 w-full rounded-xl border border-slate-100 bg-slate-900 py-5 text-xs font-black tracking-widest text-white uppercase transition-all hover:opacity-90 active:scale-95 dark:border-transparent dark:bg-white dark:text-slate-900"
            >
              Got it
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
