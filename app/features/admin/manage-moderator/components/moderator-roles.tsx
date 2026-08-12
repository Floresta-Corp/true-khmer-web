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
        <SelectTrigger className="h-10 w-full cursor-pointer rounded-lg border bg-white text-sm font-medium shadow-none sm:w-40 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
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
          className="gap-0 overflow-hidden rounded-2xl border-slate-100 bg-white p-0 sm:max-w-sm dark:border-slate-800 dark:bg-[#020617]"
        >
          <DialogHeader className="flex-row items-center gap-3 space-y-0 border-b border-slate-100 p-6 pb-5 dark:border-slate-800">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-600 bg-amber-50 text-amber-600 dark:border-none dark:bg-amber-900/20 dark:text-amber-400">
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

          <div className="space-y-6 p-6">
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
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
                className="h-11 rounded-xl border-slate-200 px-6 text-[11px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="h-11 rounded-xl bg-blue-600 px-6 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-blue-700 active:scale-95"
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
