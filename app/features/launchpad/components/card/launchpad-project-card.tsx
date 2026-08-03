import { Share2, Eye, Bookmark } from "lucide-react";
import { Card } from "~/components/ui/card";

import IconButton from "~/components/icon-button";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import { cn, resolveImageURL } from "~/lib/utils";
import { buildAbsoluteUrl, copyToClipboard } from "~/lib/clipboard";
import { useFetcher } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";

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
  const [isHover, setIsHover] = useState(false);
  const optimisticSaved =
    fetcher.state !== "idle"
      ? fetcher.formData?.get("intent") === "save"
      : item.isSaved;

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(buildAbsoluteUrl(`/launchpad/detail/${item.id}`));
  };

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

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenOpportunity(item);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHover(true)}
      onHoverEnd={() => setIsHover(false)}
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isHover ? 1 : 0, x: isHover ? 0 : 20 }}
        transition={{ duration: 0.2 }}
        className="absolute top-3.5 right-3.5 z-10 flex gap-1.5"
      >
        <IconButton
          className="size-9 bg-white text-[#65758b] shadow-sm hover:bg-white"
          icon={<Share2 className="size-3.5" />}
          ariaLabel="Share project"
          onClick={handleShareClick}
        />
        <IconButton
          className={cn(
            "size-9 bg-white text-[#65758b] shadow-sm hover:bg-white",
            {
              "bg-blue-600 text-white hover:bg-blue-600": optimisticSaved,
            },
          )}
          icon={
            <Bookmark
              className={cn("size-3.5", {
                "fill-white text-white": optimisticSaved,
              })}
            />
          }
          ariaLabel={
            optimisticSaved ? "Remove from favorites" : "Save to favorites"
          }
          onClick={handleSaveClick}
          disabled={isSubmitting}
        />
      </motion.div>
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
        className="flex min-h-112.5 cursor-pointer flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-none"
      >
        <div className="relative overflow-hidden">
          <img
            src={resolveImageURL(item.coverKey || undefined)}
            alt={`${item.name} cover`}
            className="h-44 w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge className="pointer-events-none absolute top-3.5 left-3.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#2F6FE4]">
            {item.category.name}
          </Badge>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="text-lg leading-tight font-semibold">{item.name}</div>
          <p className="mt-2 line-clamp-2 text-sm text-[#6B7280]">
            {item.description}
          </p>
          <div className="mt-auto">
            <div className="flex items-center justify-between rounded-xl bg-[#F8FAFB] px-4 py-2.5">
              <div className="text-sm font-medium text-[#99A1AF] uppercase">
                seeking:
              </div>
              <Badge className="pointer-events-none bg-white text-[#2F6FE4]">
                {item.totalRoles} ROLES
              </Badge>
            </div>
            <div className="mt-4 flex w-full items-center justify-between text-xs text-[#9EACC0]">
              <div className="flex items-center gap-1.75">
                <div>Application close:</div>
                <div className="font-semibold text-[#65758b]">
                  {formatDate(item.deadline)}
                </div>
              </div>
              <div className="flex items-center gap-1.75">
                <Eye size={14} />
                <div className="font-semibold">
                  {item.totalView.toLocaleString()} Views
                </div>
              </div>
            </div>
            {showApplyButton && (
              <Button
                variant="outline"
                onClick={handleApplyClick}
                className="mt-5 h-11 w-full rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-gray-200 hover:text-blue-700"
              >
                Apply
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
