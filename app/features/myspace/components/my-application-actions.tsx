import type { ReactNode } from "react";
import {
  Archive,
  ArchiveRestore,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Application } from "~/features/myspace/types";

interface MyApplicationActionsProps {
  application: Application;
  detailsHref?: string;
  listingHref?: string;
  trigger?: ReactNode;
  canArchive?: boolean;
  isArchived?: boolean;
  isArchiving?: boolean;
  onArchive?: () => void;
}

interface ActionMenuItemProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
}

function ActionMenuItem({
  icon,
  text,
  onClick,
  disabled,
  children,
}: ActionMenuItemProps) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-600 focus:bg-[#F8F9FA] dark:text-slate-300 dark:focus:bg-slate-800 data-disabled:cursor-not-allowed data-disabled:opacity-45"
    >
      {icon}
      {children ?? text}
    </DropdownMenuItem>
  );
}

export function MyApplicationActions({
  application,
  detailsHref,
  listingHref,
  trigger,
  canArchive,
  isArchived,
  isArchiving,
  onArchive,
}: MyApplicationActionsProps) {
  const archived = isArchived ?? Boolean(application.archivedAt);
  const isArchiveEnabled =
    Boolean(onArchive) && (archived || (canArchive ?? application.canArchive));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg hover:bg-gray-100"
            aria-label="More options"
          >
            <MoreVertical className="size-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56 rounded-2xl p-2">
        {detailsHref ? (
          <DropdownMenuItem asChild>
            <Link
              to={detailsHref}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-600 focus:bg-[#F8F9FA] dark:text-slate-300 dark:focus:bg-slate-800"
            >
              <ExternalLink className="size-4" />
              View Details
            </Link>
          </DropdownMenuItem>
        ) : null}
        {listingHref ? (
          <DropdownMenuItem asChild>
            <Link
              to={listingHref}
              className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-600 focus:bg-[#F8F9FA] dark:text-slate-300 dark:focus:bg-slate-800"
            >
              <ExternalLink className="size-4" />
              View Listing Post
            </Link>
          </DropdownMenuItem>
        ) : null}
        <ActionMenuItem
          icon={
            archived ? (
              <ArchiveRestore className="size-4" />
            ) : (
              <Archive className="size-4" />
            )
          }
          text={
            archived
              ? isArchiving
                ? "Unarchiving..."
                : "Unarchive"
              : isArchiveEnabled
                ? isArchiving
                  ? "Archiving..."
                  : "Archive"
                : "Archive"
          }
          disabled={!isArchiveEnabled || isArchiving}
          onClick={onArchive}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
