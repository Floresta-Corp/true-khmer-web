import { useState } from "react";
import { Ban, Eye, KeyRound, MoreHorizontal, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { AdminUserManagementUser } from "~/types/api-client";

import { UserSuspensionDialog } from "./user-suspension-dialog";

export function UserManagementActionsMenu({
  user,
}: {
  user: AdminUserManagementUser;
}) {
  const [suspensionDialogOpen, setSuspensionDialogOpen] = useState(false);
  const suspensionAction =
    user.status === "SUSPENDED" ? "unsuspend" : "suspend";
  const isSuspend = suspensionAction === "suspend";
  const userName = user.displayName || user.name;
  const detailPath = `/tk-admin/user/${user.id}`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-slate-400"
            aria-label={`Actions for ${userName}`}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 rounded-xl p-1.5 shadow-lg"
        >
          <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 text-xs">
            <Link to={detailPath}>
              <Eye className="size-4" />
              View Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="rounded-lg px-2.5 py-2 text-xs">
            <KeyRound className="size-4" />
            Reset Password Link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className={`rounded-lg px-2.5 py-2 text-xs ${
              isSuspend
                ? "text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/30"
                : "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-950/30"
            }`}
            onSelect={() => setSuspensionDialogOpen(true)}
          >
            {isSuspend ? (
              <Ban className="size-4" />
            ) : (
              <ShieldCheck className="size-4" />
            )}
            {isSuspend ? "Suspend Member" : "Unsuspend Member"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserSuspensionDialog
        action={suspensionAction}
        userName={userName}
        formAction={detailPath}
        open={suspensionDialogOpen}
        onOpenChange={setSuspensionDialogOpen}
      />
    </>
  );
}
