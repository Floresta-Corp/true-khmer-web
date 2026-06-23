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
            className="relative bg-white dark:bg-slate-800/60 w-full max-w-md min-h-100 rounded-3xl p-10 flex flex-col items-center justify-center gap-6 border border-slate-100 dark:border-slate-700/50"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
              <CheckCircle2
                size={40}
                strokeWidth={1.5}
                className="text-emerald-400"
              />
            </div>

            <div className="text-center space-y-5 ">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Invitation Sent
              </h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest leading-relaxed">
                The member will receive an email shortly
                <br />
                with instructions to join the workspace.
              </p>
            </div>

            <Button
              onClick={onClose}
              className="w-full py-5 mt-5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 border border-slate-100 dark:border-transparent "
            >
              Got it
            </Button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
