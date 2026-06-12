import type { ReactNode } from "react";
import { format } from "date-fns";
import {
  Activity,
  Award,
  Ban,
  ChevronRight,
  Key,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Shield,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

import { POINT_HISTORY } from "../mock-users";
import type { ConfirmationAction, PointTransaction, User } from "../types";
import { StatusBadge } from "./user-management-badges";
import {
  ConfirmationModal,
  PointsModal,
  TierModal,
} from "./user-management-modals";

type UserProfileOverlayProps = {
  selectedUser: User;
  confirmationAction: ConfirmationAction;
  showPointsModal: boolean;
  showTierModal: boolean;
  setShowPointsModal: (value: boolean) => void;
  setShowTierModal: (value: boolean) => void;
  setSelectedUser: (value: User | null) => void;
  setConfirmationAction: (value: ConfirmationAction) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
};

export function UserProfileOverlay({
  selectedUser,
  confirmationAction,
  showPointsModal,
  showTierModal,
  setShowPointsModal,
  setShowTierModal,
  setSelectedUser,
  setConfirmationAction,
  updateUser,
}: UserProfileOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-slate-950 overflow-hidden"
    >
      <UserProfileHeader
        selectedUser={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 flex flex-col items-center custom-scrollbar">
        <div className="max-w-7xl w-full px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 space-y-6">
              <UserProfileSummary user={selectedUser} />
              <UserProfileActions
                onShowTierModal={() => setShowTierModal(true)}
                onShowPointsModal={() => setShowPointsModal(true)}
                onResetPassword={() => setConfirmationAction("reset")}
                onSuspend={() => setConfirmationAction("suspend")}
              />
            </div>

            <div className="lg:col-span-8 space-y-6">
              <UserPointsOverview user={selectedUser} />
              <UserActivityHistory />
            </div>
          </div>

          <div className="h-40" />
        </div>
      </div>

      <ConfirmationModal
        selectedUser={selectedUser}
        confirmationAction={confirmationAction}
        onClose={() => setConfirmationAction(null)}
        onConfirm={(action) => {
          if (action === "suspend") {
            updateUser(selectedUser.id, { status: "suspended" });
          }
          setConfirmationAction(null);
        }}
      />

      <PointsModal
        user={selectedUser}
        open={showPointsModal}
        onClose={() => setShowPointsModal(false)}
        onUpdate={updateUser}
      />

      <TierModal
        user={selectedUser}
        open={showTierModal}
        onClose={() => setShowTierModal(false)}
        onUpdate={updateUser}
      />
    </motion.div>
  );
}

function UserProfileHeader({
  selectedUser,
  onClose,
}: {
  selectedUser: User;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-4">
        <button
          onClick={onClose}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronRight size={24} className="rotate-180" />
        </button>
        <div className="h-6 w-px bg-slate-100 dark:bg-slate-800 mx-2" />
        <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mr-8">
          User Profile
        </h2>

        <div className="hidden xl:flex items-center gap-8">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Mail size={14} className="text-slate-400" />
            <span>{selectedUser.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <MapPin size={14} className="text-slate-400" />
            <span>{selectedUser.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Phone size={14} className="text-slate-400" />
            <span>+65 8292 1010</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}

function UserProfileSummary({ user }: { user: User }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-800 shadow-inner overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-3xl font-black text-slate-300">
              {user.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          {user.name}
        </h2>
        <StatusBadge status={user.status} />
      </div>

      <div className="space-y-1.5 mb-6 text-slate-400">
        <p className="text-[11px] font-bold tracking-tight">{user.email}</p>
        <p className="text-[11px] font-bold tracking-tight flex items-center justify-center gap-2">
          <Phone size={10} className="opacity-40" />
          +65 8292 1010
        </p>
        <p className="text-[11px] font-bold tracking-tight flex items-center justify-center gap-2">
          <Award size={10} className="opacity-40" />
          Joined {format(new Date(user.joinDate), "MMM dd, yyyy")}
        </p>
        <div className="pt-2">
          <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
            Tier {user.tier}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-slate-50 dark:bg-slate-800" />
    </div>
  );
}

function UserProfileActions({
  onShowTierModal,
  onShowPointsModal,
  onResetPassword,
  onSuspend,
}: {
  onShowTierModal: () => void;
  onShowPointsModal: () => void;
  onResetPassword: () => void;
  onSuspend: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 space-y-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-4">
        Management Console
      </p>
      <button
        onClick={onShowTierModal}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:border-blue-500/30 transition-all active:scale-95"
      >
        <span className="text-xs">Modify Tier</span>
        <Award size={14} className="text-slate-400" />
      </button>
      <button
        onClick={onShowPointsModal}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:border-blue-500/30 transition-all active:scale-95"
      >
        <span className="text-xs">Modify Points</span>
        <RotateCcw size={14} className="text-slate-400" />
      </button>
      <button
        onClick={onResetPassword}
        className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:border-blue-500/30 transition-all active:scale-95"
      >
        <span className="text-xs">Reset Password Link</span>
        <Key size={14} className="text-slate-400" />
      </button>
      <button
        onClick={onSuspend}
        className="w-full flex items-center justify-between px-5 py-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/10 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
      >
        <span className="text-xs">Suspend Account</span>
        <Ban size={14} />
      </button>
    </div>
  );
}

function UserPointsOverview({ user }: { user: User }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <PointStatCard
        label="Active Points"
        value={user.activePoints}
        accent="blue"
        icon={<Zap size={10} className="text-amber-500 fill-amber-500" />}
        description="Available Balance"
      />
      <PointStatCard
        label="Tier Points"
        value={user.totalSpent}
        accent="slate"
        icon={<Activity size={10} className="text-blue-500" />}
        description="Rolling 2-yr window"
      />
      <PointStatCard
        label="Legacy Points"
        value={user.legacyPoints}
        accent="slate"
        icon={<Shield size={10} className="text-emerald-500" />}
        description="Lifetime Accumulated"
      />
    </div>
  );
}

function PointStatCard({
  label,
  value,
  accent,
  icon,
  description,
}: {
  label: string;
  value: number;
  accent: "blue" | "slate";
  icon: ReactNode;
  description: string;
}) {
  const isBlue = accent === "blue";

  return (
    <div
      className={`p-6 bg-white dark:bg-slate-900 rounded-2xl border ${
        isBlue
          ? "border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-900/5"
          : "border-slate-100 dark:border-slate-800"
      } shadow-sm`}
    >
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
        {label}
      </p>
      <p
        className={`tracking-tighter leading-none ${
          isBlue
            ? "text-4xl font-black text-blue-600 dark:text-blue-400"
            : "text-3xl font-black text-slate-900 dark:text-white"
        }`}
      >
        {value.toLocaleString()}
      </p>
      <div className="flex items-center gap-1.5 mt-2">
        {icon}
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
          {description}
        </p>
      </div>
    </div>
  );
}

function UserActivityHistory() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
          Recent Activity
        </h3>
      </div>
      <div className="space-y-1">
        {POINT_HISTORY.slice(0, 4).map((activity) => (
          <ActivityRow key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityRow({ activity }: { activity: PointTransaction }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 px-2 -mx-2 rounded-lg transition-colors group">
      <div className="flex items-center gap-4">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            activity.amount > 0
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500"
              : "bg-rose-50 dark:bg-rose-900/20 text-rose-500"
          }`}
        >
          {activity.amount > 0 ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight mb-0.5">
            {activity.reason}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {format(new Date(activity.date), "MMM dd, HH:mm")}
          </p>
        </div>
      </div>
      <div
        className={`text-xs font-black px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/50 ${
          activity.amount > 0 ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {activity.amount > 0 ? "+" : ""}
        {activity.amount}
      </div>
    </div>
  );
}
