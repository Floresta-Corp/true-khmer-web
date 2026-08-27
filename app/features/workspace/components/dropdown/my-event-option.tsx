import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Link } from "react-router";
import { Eye, MoreHorizontal, Pencil, Share2 } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { buildAbsoluteUrl, copyToClipboard } from "~/lib/clipboard";
import type { MyEvent } from "~/features/workspace/types/my-events";

type Props = {
  event: MyEvent;
};

/**
 * Card overflow menu. Only actions that already have a destination are
 * offered — cancel/duplicate land with the events mutation endpoints.
 */
export default function MyEventOption({ event }: Props) {
  const isDraft = event.status === "DRAFT";
  const publicHref = `/events/detail/${event.id}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Options for ${event.title}`}
        className="flex size-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:outline-none"
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 rounded-xl">
        <DropdownMenuItem asChild>
          <Link to={isDraft ? "/my-events/create" : publicHref}>
            {isDraft ? (
              <>
                <Pencil className="size-4" />
                Continue setup
              </>
            ) : (
              <>
                <Eye className="size-4" />
                View event page
              </>
            )}
          </Link>
        </DropdownMenuItem>

        {!isDraft && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                void copyToClipboard(buildAbsoluteUrl(publicHref));
              }}
            >
              <Share2 className="size-4" />
              Copy event link
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
