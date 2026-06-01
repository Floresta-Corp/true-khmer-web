import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  Archive,
  CalendarClock,
  CheckCircle,
  Copy,
  Globe,
  MoreHorizontal,
  Pencil,
  Share2,
  Star,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useFetcher, useNavigate } from "react-router";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type {
  ManagePostStatus,
  PostingType,
  SourceType,
  UpdateManagePostResponse,
} from "~/services/manage-post/types";

type Props = {
  status: ManagePostStatus;
  sourceType: SourceType | PostingType;
  postingId: string;
};

const SOURCE_TYPE_TO_ROUTE: Record<string, "projects" | "volunteer"> = {
  PROJECT: "projects",
  projects: "projects",
  VOLUNTEER: "volunteer",
  volunteer: "volunteer",
};

export default function ManagePostOption({
  status,
  sourceType,
  postingId,
}: Props) {
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const managePostSourceType = SOURCE_TYPE_TO_ROUTE[sourceType] ?? "volunteer";
  const sourceTypeRoute =
    managePostSourceType === "projects" ? "launchpad" : "volunteer";
  const editRoute = `/${sourceTypeRoute}/edit/${postingId}`;

  const handleAction = (postingAction: UpdateManagePostResponse) => {
    fetcher.submit(
      { postingAction },
      {
        method: "POST",
        action: `/manage-post/${managePostSourceType}/${postingId}`,
      },
    );
  };
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(editRoute);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="h-11 w-11 rounded-xl  text-gray-400 bg-white hover:text-blue-600 hover:border-blue-600 flex items-center justify-center shrink-0 cursor-pointer"
        >
          <MoreHorizontal size={20} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        align="end"
        className="w-52 rounded-2xl p-2 shadow-xl border-gray-100"
      >
        {status === "LIVE" && (
          <>
            <DropdownMenuItem
              onClick={handleEdit}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <Pencil size={16} className="text-slate-400" />
              Edit Posting
            </DropdownMenuItem>
            <DropdownMenuItem
              // onClick={() => handleAction("cancel")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <CalendarClock size={16} className="text-slate-400" />
              Extend Deadline
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction("close")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <X size={16} className="text-slate-400" />
              Close Recruitment
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              // onClick={() => handleAction("SHARE")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <Share2 size={16} className="text-slate-400" />
              Share Posting
            </DropdownMenuItem> */}
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => handleAction("cancel")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
            >
              <Trash2 size={16} />
              Cancel Posting
            </DropdownMenuItem>
          </>
        )}

        {status === "IN_PROGRESS" && (
          <>
            <DropdownMenuItem
              onClick={handleEdit}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <Pencil size={16} className="text-slate-400" />
              Edit Posting
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              // onClick={() => handleAction("reopen_recruitment")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <UserCheck size={16} className="text-slate-400" />
              Reopen Recruitment
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={() => handleAction("mark_complete")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-green-600 font-medium"
            >
              <CheckCircle size={16} className="text-green-600" />
              Mark as Completed
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => handleAction("cancel")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
            >
              <Trash2 size={16} />
              Cancel Posting
            </DropdownMenuItem>
          </>
        )}

        {status === "DRAFT" && (
          <>
            <DropdownMenuItem
              onClick={handleEdit}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <Pencil size={16} className="text-slate-400" />
              Edit Posting
            </DropdownMenuItem>
            <DropdownMenuItem
              // onClick={() => handleAction("")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <Globe size={16} className="text-slate-400" />
              Publish
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              onClick={() => handleAction("delete")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
            >
              <Trash2 size={16} />
              Delete
            </DropdownMenuItem>
          </>
        )}

        {status === "COMPLETED" && (
          <>
            <DropdownMenuItem
              // onClick={() => handleAction("")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <Users size={16} className="text-slate-400" />
              View Participants
            </DropdownMenuItem>
            <DropdownMenuItem
              // onClick={() => handleAction("")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <Star size={16} className="text-slate-400" />
              Rate Participants
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              // onClick={() => handleAction("")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-slate-700 font-medium"
            >
              <Archive size={16} className="text-slate-400" />
              Archive Project
            </DropdownMenuItem>
          </>
        )}

        {status === "CANCELED" && (
          <>
            <DropdownMenuItem
              onClick={() => handleAction("delete")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-500 font-medium focus:text-red-500 focus:bg-red-50"
            >
              <Trash2 size={16} />
              Delete Posting
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
