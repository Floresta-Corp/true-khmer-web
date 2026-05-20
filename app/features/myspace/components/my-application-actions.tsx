import { Archive, EllipsisVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface MyApplicationActionsProps {
  applicationId: string;
  onArchive?: (applicationId: string) => void;
}

export function MyApplicationActions({
  applicationId,
  onArchive,
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
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuItem
          onSelect={() => onArchive(applicationId)}
          className="text-gray-600 text-sm flex items-center gap-2"
        >
          <Archive size={14} />
          <span>move to archived</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
