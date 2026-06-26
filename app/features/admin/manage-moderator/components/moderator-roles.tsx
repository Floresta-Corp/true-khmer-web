import { Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "MODERATOR", label: "Moderator" },
] as const;

type RoleValue = (typeof ROLES)[number]["value"];

interface ModeratorRolesProps {
  currentRole: RoleValue | string;
  onRoleConfirm: (
    memberId: string,
    currentRole: RoleValue | string,
    newRole: RoleValue,
  ) => void;
  memberId: string;
  disabled?: boolean;
}

export function ModeratorRoles({
  currentRole,
  onRoleConfirm,
  memberId,
  disabled = false,
}: ModeratorRolesProps) {
  const [pendingRoleChange, setPendingRoleChange] = useState<RoleValue | null>(
    null,
  );

  const handleRoleSelect = (value: RoleValue) => {
    if (value !== currentRole) {
      setPendingRoleChange(value);
    }
  };

  const handleConfirm = () => {
    if (pendingRoleChange) {
      onRoleConfirm(memberId, currentRole, pendingRoleChange);
      setPendingRoleChange(null);
    }
  };

  const handleCancel = () => {
    setPendingRoleChange(null);
  };

  const formatRoleLabel = (role: RoleValue) => {
    return role === "SUPER_ADMIN" ? "Super Admin" : "Moderator";
  };

  return (
    <>
      <Select
        value={currentRole}
        onValueChange={handleRoleSelect}
        disabled={disabled}
      >
        <SelectTrigger className="h-10 w-full rounded-lg cursor-pointer bg-white dark:border-slate-800 border text-sm font-medium shadow-none sm:w-40 dark:bg-slate-900/50 dark:text-slate-300">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>

        <SelectContent>
          {ROLES.map((role) => (
            <SelectItem
              key={role.value}
              value={role.value}
              className="cursor-pointer"
            >
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog
        open={!!pendingRoleChange}
        onOpenChange={(open) => {
          if (!open) setPendingRoleChange(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-sm p-0 overflow-hidden gap-0 bg-white dark:bg-[#020617] border-slate-100 dark:border-slate-800 rounded-2xl"
        >
          <DialogHeader className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800 flex-row items-center gap-3 space-y-0">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-600 dark:border-none flex items-center justify-center shrink-0">
              <Shield size={18} />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Change Role
            </DialogTitle>
            <button
              type="button"
              className="ml-auto text-slate-400 hover:text-slate-900 dark:hover:text-white"
              onClick={handleCancel}
            >
              ✕
            </button>
          </DialogHeader>

          <div className="p-6 space-y-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to change this member's access role to{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {pendingRoleChange ? formatRoleLabel(pendingRoleChange) : ""}
              </span>
              ?
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="h-11 px-6 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
