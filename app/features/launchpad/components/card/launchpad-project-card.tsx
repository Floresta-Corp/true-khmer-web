import { Share2, Bookmark, MapPin, Calendar } from "lucide-react";
import { Card } from "~/components/ui/card";

import IconButton from "~/components/icon-button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import { cn, resolveImageURL } from "~/lib/utils";
import { buildAbsoluteUrl, copyToClipboard } from "~/lib/clipboard";
import { useFetcher } from "react-router";
import { motion } from "motion/react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateRange = (fromString: string, toString: string) => {
  const from = new Date(fromString);
  const to = new Date(toString);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return "Invalid date";
  }

  return `${from.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
  })} - ${to.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
};

interface LaunchpadProjectCardProps {
  item: LaunchpadOpportunity;
  onOpenOpportunity: (opportunity: LaunchpadOpportunity) => void;
  showApplyButton?: boolean;
}

export default function LaunchpadProjectCard({
  item,
  onOpenOpportunity,
  showApplyButton = false,
}: LaunchpadProjectCardProps) {
  const fetcher = useFetcher<{ ok: boolean; saved: boolean }>();
  const isSubmitting = fetcher.state !== "idle";
  const optimisticSaved =
    fetcher.state !== "idle"
      ? fetcher.formData?.get("intent") === "save"
      : item.isSaved;

  // const handleShareClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   copyToClipboard(buildAbsoluteUrl(`/launchpad/detail/${item.id}`));
  // };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isSubmitting) {
      return;
    }

    fetcher.submit(
      { launchpadId: item.id, intent: optimisticSaved ? "unsave" : "save" },
      { method: "POST", action: "/api/launchpad/save" },
    );
  };

  // const handleApplyClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onOpenOpportunity(item);
  // };

  return (
    <motion.div
      className="group relative h-full"
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
        {/* <IconButton
          className="size-8 rounded-full bg-white text-[#111827] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.08)] hover:bg-white"
          icon={<Share2 className="size-4" />}
          ariaLabel="Share project"
          onClick={handleShareClick}
        /> */}
        <IconButton
          className={cn(
            "size-8 rounded-full bg-white text-[#111827] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.08)] hover:bg-white",
            optimisticSaved &&
              "bg-[#2f6fe4] text-white hover:bg-[#2f6fe4] hover:text-white",
          )}
          icon={
            <Bookmark
              className={cn("size-4", optimisticSaved && "fill-current")}
              strokeWidth={2}
            />
          }
          ariaLabel={
            optimisticSaved ? "Remove from favorites" : "Save to favorites"
          }
          onClick={handleSaveClick}
          disabled={isSubmitting}
        />
      </div>
      <Card
        role="button"
        tabIndex={0}
        onClick={() => onOpenOpportunity(item)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpenOpportunity(item);
          }
        }}
        className="flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-[#eceef2] bg-white p-0 transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(26,26,46,0.10)]"
      >
        <div className="relative shrink-0 overflow-hidden">
          <img
            src={resolveImageURL(item.coverKey || undefined)}
            alt={`${item.name} cover`}
            className="h-42 w-full object-cover transition-transform"
          />
          <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold tracking-[-0.1px] text-[#111827] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.08)]">
            {item.category.name}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 px-5 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage
                src={resolveImageURL(item.createdBy.avatarKey || undefined)}
                alt={item.createdBy.name}
              />
              <AvatarFallback className="text-[10px] font-semibold">
                {item.createdBy.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-[13px] font-medium text-[#4a5565]">
              {item.createdBy.name}
            </span>
          </div>

          <h3 className="text-[17px] leading-5.5 font-bold tracking-[-0.3px] text-[#111827] transition-colors duration-300 group-hover:text-[#2f6fe4]">
            {item.name}
          </h3>

          <span className="inline-flex w-fit items-center rounded-lg bg-[#eff4fe] px-2.5 py-1 text-[12.5px] font-semibold text-[#2f6fe4]">
            Seeking {item.totalRoles} {item.totalRoles > 1 ? "roles" : "role"}
          </span>

          <div className="flex flex-col gap-1.5 text-[12.5px] font-medium text-[#8b93a1]">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{item.city.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="shrink-0" />
              <span className="truncate">
                {formatDateRange(item.createdAt, item.deadline)}
              </span>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#f1f2f4] pt-3">
            <span className="text-[12.5px] font-bold text-[#4a5565]">
              Deadline:
            </span>
            <span className="text-[12.5px] font-bold whitespace-nowrap text-[#111827]">
              {formatDate(item.deadline)}
            </span>
          </div>

          {/* {showApplyButton && (
            <Button
              variant="outline"
              onClick={handleApplyClick}
              className="mt-2 h-11 w-full rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-gray-200 hover:text-blue-700"
            >
              Apply
            </Button>
          )} */}
        </div>
      </Card>
    </motion.div>
  );
}
