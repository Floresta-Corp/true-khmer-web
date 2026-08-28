import { BackLink } from "~/components/back-link";
import {
  Bookmark,
  ChevronLeft,
  Flag,
  MoreVertical,
  Share2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

interface CourseActionBarProps {
  backTo: string;
  backLabel?: string;
  /** Design uses 20px under this row on course detail, 18px on the learning screen. */
  className?: string;
  isSaved: boolean;
  onToggleSave: () => void;
  onShare: () => void;
  onReport: () => void;
}

/** Back link plus the save / share / report controls shared by the course
 * detail and course learning screens. */
export function CourseActionBar({
  backTo,
  backLabel = "Back",
  className,
  isSaved,
  onToggleSave,
  onShare,
  onReport,
}: CourseActionBarProps) {
  return (
    <div
      className={cn("mb-5 flex items-center justify-between gap-4", className)}
    >
      <BackLink
        to={backTo}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#1C5DD4] hover:underline"
      >
        <ChevronLeft className="size-4" aria-hidden />
        {backLabel}
      </BackLink>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label={isSaved ? "Remove from saved" : "Save course"}
          aria-pressed={isSaved}
          onClick={onToggleSave}
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <Bookmark
            aria-hidden
            className={cn(
              "size-4.5",
              isSaved
                ? "fill-[#1C5DD4] text-[#1C5DD4]"
                : "fill-none text-[#9A9AB0]",
            )}
          />
        </button>

        <button
          type="button"
          aria-label="Share course"
          onClick={onShare}
          className="flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
        >
          <Share2 className="size-4.5 text-[#9A9AB0]" aria-hidden />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More options"
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
            >
              <MoreVertical className="size-4.5 text-[#9A9AB0]" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[170px] rounded-[10px] p-1.5 font-tk-edu shadow-[0_8px_28px_rgba(26,26,46,0.14)]"
          >
            <DropdownMenuItem
              onSelect={onReport}
              className="gap-2.5 px-3 py-2.5 font-semibold text-[#FB3748] focus:text-[#FB3748]"
            >
              <Flag className="size-4" aria-hidden />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
