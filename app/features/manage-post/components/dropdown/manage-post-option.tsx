import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  CalendarClock,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function ManagePostOption() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50 transition-colors z-10"
          >
            <MoreHorizontal size={20} />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          onClick={(e) => e.stopPropagation()}
          align="end"
          className="w-52 rounded-2xl p-2 shadow-xl border-gray-100"
        >
          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium">
            <Pencil size={16} className="text-slate-400" />
            Edit Posting
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium">
            <CalendarClock size={16} className="text-slate-400" />
            Extend Deadline
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium">
            <X size={16} className="text-slate-400" />
            Close Recruitment
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium">
            <Share2 size={16} className="text-slate-400" />
            Share Posting
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 font-medium focus:text-red-500 focus:bg-red-50">
            <Trash2 size={16} />
            Cancel Posting
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
