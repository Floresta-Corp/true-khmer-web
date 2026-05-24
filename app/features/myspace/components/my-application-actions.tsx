import type { ReactNode } from "react";
import { Archive, EllipsisVertical } from "lucide-react";
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
}

interface ActionMenuItemProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
}

function ActionMenuItem({ icon, text, onClick }: ActionMenuItemProps) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl text-sm text-gray-600"
    >
      {icon}
      {text}
    </DropdownMenuItem>
  );
}

export function MyApplicationActions({
  application,
}: MyApplicationActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-gray-100"
          aria-label="More options"
        >
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 rounded-xl p-1">
        <ActionMenuItem icon={<Archive size={14} />} text="Archive" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
