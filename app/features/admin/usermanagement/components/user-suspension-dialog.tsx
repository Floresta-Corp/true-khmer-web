import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useFetcher } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "~/components/ui/dialog";

import type { userManagementDetailAction } from "../service/user-management-detail.action";

type UserSuspensionDialogProps = {
  action: "suspend" | "unsuspend";
  userName: string;
  formAction?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserSuspensionDialog({
  action,
  userName,
  formAction,
  open,
  onOpenChange,
}: UserSuspensionDialogProps) {
  const fetcher = useFetcher<typeof userManagementDetailAction>();
  const isSubmitting = fetcher.state !== "idle";
  const isSuspend = action === "suspend";

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      onOpenChange(false);
    }
  }, [fetcher.data, fetcher.state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogTitle className="text-xl font-bold">
          {isSuspend ? "Suspend account?" : "Restore account access?"}
        </DialogTitle>
        <DialogDescription className="leading-6">
          {isSuspend
            ? `${userName} will immediately lose access to the platform.`
            : `${userName} will regain access to the platform.`}
        </DialogDescription>

        {fetcher.data && "error" in fetcher.data ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {fetcher.data.error}
          </p>
        ) : null}

        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </DialogClose>
          <fetcher.Form method="post" action={formAction}>
            <input type="hidden" name="action" value={action} />
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={isSuspend ? "destructive" : "default"}
              className={
                isSuspend
                  ? ""
                  : "bg-emerald-600 text-white hover:bg-emerald-700"
              }
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : null}
              {isSubmitting
                ? "Updating..."
                : isSuspend
                  ? "Suspend account"
                  : "Unsuspend account"}
            </Button>
          </fetcher.Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
