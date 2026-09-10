import { Link } from "react-router";
import {
  Bookmark,
  Briefcase,
  CalendarDays,
  GraduationCap,
  HandHeart,
  MessageSquare,
} from "lucide-react";
import { formatRelativeTime } from "~/lib/datetime";
import { cn } from "~/lib/utils";
import type { SavedItemCard as SavedItemCardData } from "../types";

/**
 * One card for every saved row. The API hands back a single flat shape, so
 * nothing here branches on where the item came from beyond its label and icon.
 */
export const SAVED_ITEM_APPEARANCE = {
  forum: {
    label: "Forum",
    icon: MessageSquare,
    tone: "bg-sky-50 text-sky-700",
  },
  volunteer: {
    label: "Volunteer",
    icon: HandHeart,
    tone: "bg-rose-50 text-rose-700",
  },
  project: {
    label: "Project",
    icon: Briefcase,
    tone: "bg-amber-50 text-amber-700",
  },
  course: {
    label: "Course",
    icon: GraduationCap,
    tone: "bg-violet-50 text-violet-700",
  },
  event: {
    label: "Event",
    icon: CalendarDays,
    tone: "bg-emerald-50 text-emerald-700",
  },
} as const;

interface SavedItemCardProps {
  item: SavedItemCardData;
  onUnsave: (item: SavedItemCardData) => void;
  isRemoving?: boolean;
}

export default function SavedItemCard({
  item,
  onUnsave,
  isRemoving = false,
}: SavedItemCardProps) {
  const { label, icon: Icon, tone } = SAVED_ITEM_APPEARANCE[item.type];

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-slate-100 bg-white transition-shadow hover:shadow-md",
        isRemoving && "pointer-events-none opacity-50",
      )}
    >
      <Link to={item.webHref} className="block" prefetch="intent">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            loading="lazy"
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-slate-50">
            <Icon className="size-10 text-slate-300" />
          </div>
        )}

        <div className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                tone,
              )}
            >
              <Icon size={13} />
              {label}
            </span>
            {item.isExternal && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                External
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-base font-semibold text-slate-900">
            {item.title || "Untitled"}
          </h3>
          <p className="mt-2 text-xs font-medium text-slate-400">
            Saved {formatRelativeTime(item.savedAt)}
          </p>
        </div>
      </Link>

      <button
        type="button"
        aria-label={`Remove ${item.title || "item"} from saved`}
        onClick={() => onUnsave(item)}
        disabled={isRemoving}
        className="absolute top-3 right-3 cursor-pointer rounded-full bg-white/90 p-2 text-blue-600 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-blue-700 disabled:cursor-not-allowed"
      >
        <Bookmark size={16} className="fill-current" />
      </button>
    </article>
  );
}
