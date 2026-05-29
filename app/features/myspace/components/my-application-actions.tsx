import type { ReactNode } from "react";
import {
  Archive,
  ExternalLink,
  Mail,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import type { Application } from "~/services/myspace/types";

interface MyApplicationActionsProps {
  application: Application;
  detailsHref?: string;
  trigger?: ReactNode;
  canArchive?: boolean;
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
      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-600 focus:bg-[#F8F9FA] data-disabled:cursor-not-allowed data-disabled:opacity-45 dark:text-slate-300 dark:focus:bg-slate-800"
    >
      {icon}
      {children ?? text}
    </DropdownMenuItem>
  );
}

export function MyApplicationActions({
  application,
  detailsHref,
  trigger,
  canArchive,
  isArchiving,
  onArchive,
}: MyApplicationActionsProps) {
  const isTerminal = ["COMPLETED", "WITHDRAWN", "DECLINED"].includes(
    application.status.toUpperCase(),
  );
  const isArchiveEnabled = canArchive ?? isTerminal;

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
        <ActionMenuItem
          icon={<ExternalLink className="size-4" />}
          text="View Listing Post"
          disabled
        />
        <ActionMenuItem
          icon={<Mail className="size-4" />}
          text="Contact Organizer"
          disabled
        />
        <ActionMenuItem
          icon={<Archive className="size-4" />}
          text={isArchiveEnabled ? "Archive" : "Archive when completed"}
          disabled={!isArchiveEnabled || isArchiving}
          onClick={onArchive}
        />
        {isTerminal ? (
          <ActionMenuItem
            icon={<Trash2 className="size-4" />}
            text="Delete"
            disabled
          />
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
