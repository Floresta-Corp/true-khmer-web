import { format } from "date-fns";
import {
  ChevronRight,
  Fingerprint,
  Key,
  MoreHorizontal,
  ShieldAlert,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { ConfirmationAction, User, UserStatus } from "../types";
import { StatusBadge, UserTierBadge } from "./user-management-badges";

type UserTableProps = {
  users: User[];
  activeDropdown: string | null;
  isSuperAdmin: boolean;
  setActiveDropdown: (value: string | null) => void;
  setSelectedUser: (value: User) => void;
  setConfirmationAction: (value: ConfirmationAction) => void;
  handleSort: (key: keyof User) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  redactEmail: (email: string) => string;
};

export function UserTable({
  users,
  activeDropdown,
  isSuperAdmin,
  setActiveDropdown,
  setSelectedUser,
  setConfirmationAction,
  handleSort,
  updateUser,
  redactEmail,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-200 table-fixed text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50 dark:border-slate-800">
            <SortableHeader label="User" sortKey="name" onSort={handleSort} />
            <HeaderCell label="Tier" align="center" className="w-[12%]" />
            <HeaderCell label="Points" align="center" className="w-[14%]" />
            <HeaderCell label="Status" align="center" className="w-[14%]" />
            <HeaderCell
              label="Last Active"
              align="center"
              className="w-[14%]"
            />
            <HeaderCell label="Actions" align="right" className="w-[12%]" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer group"
            >
              <UserCell
                user={user}
                isSuperAdmin={isSuperAdmin}
                redactEmail={redactEmail}
              />
              <td className="px-10 py-6 text-center">
                <UserTierBadge tier={user.tier} />
              </td>
              <td className="px-10 py-6 text-center">
                <span className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                  {user.activePoints.toLocaleString()}
                </span>
              </td>
              <td className="px-10 py-6 text-center">
                <StatusBadge status={user.status} />
              </td>
              <td className="px-10 py-6 text-center text-xs font-medium text-slate-400">
                {user.lastActive === "Never"
                  ? "Never"
                  : format(new Date(user.lastActive), "d MMM yyyy")}
              </td>
              <td className="px-10 py-6 text-right relative">
                <ActionDropdown
                  user={user}
                  isOpen={activeDropdown === user.id}
                  onToggle={() =>
                    setActiveDropdown(
                      activeDropdown === user.id ? null : user.id,
                    )
                  }
                  onSelect={(action) => {
                    setSelectedUser(user);
                    if (action === "reset" || action === "suspend") {
                      setConfirmationAction(action);
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortableHeader({
  label,
  sortKey,
  onSort,
}: {
  label: string;
  sortKey: keyof User;
  onSort: (key: keyof User) => void;
}) {
  return (
    <th
      onClick={() => onSort(sortKey)}
      className="w-[34%] px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 transition-colors"
    >
      <div className="flex items-center gap-2">
        {label}
        <ChevronRight size={12} className="rotate-90 opacity-40" />
      </div>
    </th>
  );
}

function HeaderCell({
  label,
  align,
  className,
}: {
  label: string;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  return (
    <th
      className={`px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest ${
        align === "center"
          ? "text-center"
          : align === "right"
            ? "text-right"
            : "text-left"
      } ${className ?? ""}`}
    >
      {label}
    </th>
  );
}

function UserCell({
  user,
  isSuperAdmin,
  redactEmail,
}: {
  user: User;
  isSuperAdmin: boolean;
  redactEmail: (email: string) => string;
}) {
  return (
    <td className="px-10 py-6 min-w-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xs font-black text-slate-400">
              {user.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </span>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-black text-slate-900 dark:text-white truncate">
            {user.name}
          </span>
          <span className="text-[11px] font-medium text-slate-400 truncate">
            {isSuperAdmin ? user.email : redactEmail(user.email)}
          </span>
        </div>
      </div>
    </td>
  );
}

function ActionDropdown({
  user,
  isOpen,
  onToggle,
  onSelect,
}: {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (action: ConfirmationAction) => void;
}) {
  if (!isOpen) {
    return (
      <button
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
      >
        <MoreHorizontal size={20} />
      </button>
    );
  }

  return (
    <>
      <button
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
      >
        <MoreHorizontal size={20} />
      </button>

      <AnimatePresence>
        <div
          className="fixed inset-0 z-[80]"
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="absolute right-full mr-2 top-0 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-[90] overflow-hidden py-2"
        >
          <button
            onClick={(event) => {
              event.stopPropagation();
              onSelect(null);
            }}
            className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
          >
            <Fingerprint size={14} /> View Details
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onSelect("reset");
            }}
            className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors"
          >
            <Key size={14} /> Reset Password Link
          </button>
          <div className="my-2 border-t border-slate-50 dark:border-slate-800" />
          <button
            onClick={(event) => {
              event.stopPropagation();
              onSelect("suspend");
            }}
            className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-3 transition-colors"
          >
            <ShieldAlert size={14} /> Suspend Member
          </button>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
