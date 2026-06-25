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
}

export default function RemoveModeratorMember({
  memberId,
  firstName,
  lastName,
  onRemove,
}: RemoveModeratorMemberProps) {
  const [showConfirm, setShowConfirm] = useState(false);

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
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-900 data-[state=open]:text-slate-900 dark:data-[state=open]:text-white"
          >
            <MoreVertical size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl"
        >
          <DropdownMenuItem
            onSelect={() => setShowConfirm(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest text-rose-500 transition-colors cursor-pointer focus:bg-rose-500/10 focus:text-rose-600 dark:focus:bg-rose-500/20 dark:focus:text-rose-400"
          >
            <Trash2 size={14} /> Remove Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-sm p-0 overflow-hidden gap-0 bg-white dark:bg-[#020617] border-slate-100 dark:border-slate-800 rounded-2xl"
        >
          <DialogHeader className="p-6 pb-5 border-b border-slate-100 dark:border-slate-800 flex-row items-center gap-3 space-y-0">
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600  dark:text-rose-400 border border-rose-600 dark:border-none flex items-center justify-center shrink-0">
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

          <div className="p-6 space-y-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
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
                className="h-11 px-6 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirm}
                className="h-11 px-6 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all"
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
