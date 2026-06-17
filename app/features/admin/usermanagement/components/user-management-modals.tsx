import { Award, Key, ShieldAlert } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { ConfirmationAction, User, UserTier } from "../types";

export function ConfirmationModal({
  selectedUser,
  confirmationAction,
  onClose,
  onConfirm,
}: {
  selectedUser: User;
  confirmationAction: ConfirmationAction;
  onClose: () => void;
  onConfirm: (action: NonNullable<ConfirmationAction>) => void;
}) {
  if (!confirmationAction) return null;

  const isSuspend = confirmationAction === "suspend";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-10 border border-slate-100 dark:border-slate-800 shadow-2xl text-center"
        >
          <div
            className={`w-20 h-20 rounded-[32px] flex items-center justify-center mx-auto mb-6 ${
              isSuspend
                ? "bg-rose-500/10 text-rose-500"
                : "bg-blue-500/10 text-blue-500"
            }`}
          >
            {isSuspend ? <ShieldAlert size={40} /> : <Key size={40} />}
          </div>
          <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            {isSuspend ? "Suspend Account?" : "Reset Password?"}
          </h3>
          <p className="text-slate-500 font-medium mb-10 text-sm leading-relaxed mx-auto max-w-[240px]">
            {isSuspend
              ? `Are you sure you want to suspend ${selectedUser.name}'s account? They will lose platform access immediately.`
              : `We will generate a new password reset link for ${selectedUser.name}. This will invalidate any previous links.`}
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => onConfirm(confirmationAction)}
              className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-lg ${
                isSuspend
                  ? "bg-rose-600 shadow-rose-500/20 hover:bg-rose-700"
                  : "bg-blue-600 shadow-blue-500/20 hover:bg-blue-700"
              }`}
            >
              Confirm Action
            </button>
            <button
              onClick={onClose}
              className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Nevermind, Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function PointsModal({
  user,
  open,
  onClose,
  onUpdate,
}: {
  user: User;
  open: boolean;
  onClose: () => void;
  onUpdate: (userId: string, updates: Partial<User>) => void;
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-2xl"
        >
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">
            Adjust Points
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Point Amount
              </label>
              <input
                id="pointAmountInput"
                type="number"
                placeholder="Enter amount..."
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  const input = document.getElementById(
                    "pointAmountInput",
                  ) as HTMLInputElement;
                  const value = Number.parseInt(input.value || "0");

                  onUpdate(user.id, {
                    activePoints: user.activePoints + value,
                  });
                  onClose();
                }}
                className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
              >
                Add Points
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById(
                    "pointAmountInput",
                  ) as HTMLInputElement;
                  const value = Number.parseInt(input.value || "0");

                  onUpdate(user.id, {
                    activePoints: Math.max(0, user.activePoints - value),
                  });
                  onClose();
                }}
                className="flex-1 py-3.5 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 shadow-lg shadow-rose-500/20"
              >
                Deduct Points
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function TierModal({
  user,
  open,
  onClose,
  onUpdate,
}: {
  user: User;
  open: boolean;
  onClose: () => void;
  onUpdate: (userId: string, updates: Partial<User>) => void;
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 shadow-2xl"
        >
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">
            Modify User Tier
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {([1, 2, 3] as UserTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => {
                  onUpdate(user.id, { tier });
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  user.tier === tier
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white hover:border-blue-500"
                }`}
              >
                <span className="text-sm font-bold">Tier {tier} Member</span>
                <Award
                  size={18}
                  className={
                    user.tier === tier ? "text-white" : "text-slate-400"
                  }
                />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
