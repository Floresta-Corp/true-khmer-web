import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

interface InviteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteSuccessModal({
  isOpen,
  onClose,
}: InviteSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-[#020617] w-full max-w-sm rounded-[32px] p-10 text-center border border-slate-100 dark:border-slate-800 shadow-2xl"
      >
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
          Invitation Sent
        </h3>
        <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed uppercase tracking-widest text-[10px]">
          The member will receive an email shortly with instructions to join the
          workspace.
        </p>

        <button
          onClick={onClose}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
        >
          Got it
        </button>
      </motion.div>
    </div>
  );
}
