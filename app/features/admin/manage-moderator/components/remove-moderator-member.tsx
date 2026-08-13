import { useState } from "react";
import { MoreVertical, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface RemoveModeratorMemberProps {
  memberId: string;
  firstName: string;
  lastName?: string;
  onRemove: (id: string) => void;
  currentUserId?: string;
}

export default function RemoveModeratorMember({
  memberId,
  firstName,
  lastName,
  onRemove,
  currentUserId,
}: RemoveModeratorMemberProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  // Don't render anything if the current user is trying to remove themselves
  if (currentUserId && memberId === currentUserId) {
    return null;
  }

  const handleConfirm = () => {
    onRemove(memberId);
    setShowConfirm(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white dark:data-[state=open]:bg-slate-900 dark:data-[state=open]:text-white"
          >
            <MoreVertical size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 rounded-xl border border-slate-100 bg-white p-2 dark:border-slate-800 dark:bg-slate-900"
        >
          <DropdownMenuItem
            onSelect={() => setShowConfirm(true)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-black tracking-widest text-rose-500 uppercase transition-colors focus:bg-rose-500/10 focus:text-rose-600 dark:focus:bg-rose-500/20 dark:focus:text-rose-400"
          >
            <Trash2 size={14} /> Remove Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent
          showCloseButton={false}
          className="gap-0 overflow-hidden rounded-2xl border-slate-100 bg-white p-0 sm:max-w-sm dark:border-slate-800 dark:bg-[#020617]"
        >
          <DialogHeader className="flex-row items-center gap-3 space-y-0 border-b border-slate-100 p-6 pb-5 dark:border-slate-800">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-rose-600 bg-rose-50 text-rose-600 dark:border-none dark:bg-rose-900/20 dark:text-rose-400">
              <AlertTriangle size={18} />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Remove Member
            </DialogTitle>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="ml-auto text-slate-400 hover:text-slate-900 dark:hover:text-white"
              onClick={() => setShowConfirm(false)}
            >
              ✕
            </Button>
          </DialogHeader>

          <div className="space-y-6 p-6">
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {firstName} {lastName ?? ""}
              </span>{" "}
              from the moderators? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="h-11 rounded-xl border-slate-200 px-6 text-[11px] font-black tracking-widest text-slate-600 uppercase transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="h-11 rounded-xl bg-rose-500 px-6 text-xs font-black tracking-widest text-white uppercase transition-all hover:bg-rose-600 active:scale-95"
              >
                Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
