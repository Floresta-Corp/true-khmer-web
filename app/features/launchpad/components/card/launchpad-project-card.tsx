import { MapPin, Share2, Eye, Bookmark } from "lucide-react";
import { Card } from "~/components/ui/card";

import IconButton from "~/components/icon-button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import type { LaunchpadOpportunity } from "~/features/launchpad/types";
import { cn, resolveImageURL } from "~/lib/utils";
import { buildAbsoluteUrl, copyToClipboard } from "~/lib/clipboard";
import { useFetcher } from "react-router";

interface LaunchpadProjectCardProps {
  item: LaunchpadOpportunity;
  onOpenOpportunity: (opportunity: LaunchpadOpportunity) => void;
}

export default function LaunchpadProjectCard({
  item,
  onOpenOpportunity,
}: LaunchpadProjectCardProps) {
  const fetcher = useFetcher<{ ok: boolean; saved: boolean }>();
  const isSubmitting = fetcher.state !== "idle";

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
    <div className="relative">
      <div className="absolute top-4.5 right-4.5 z-10 flex gap-1.5">
        <IconButton
          className="size-8 border border-gray-100"
          icon={<Share2 className="size-3.5" />}
          ariaLabel="Share project"
          onClick={handleShareClick}
        />
        <IconButton
          className={cn(
            "flex size-8 cursor-pointer items-center justify-center rounded-2xl border border-gray-100",
            { "bg-blue-600": optimisticSaved },
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
        className="flex min-h-95 cursor-pointer flex-col rounded-2xl bg-white p-5 shadow-none transition-all hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-baseline gap-1 text-blue-500">
            <MapPin className="size-3" />
            <p className="text-sm">{item.city.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3.5 pb-6">
          <div className="size-12.25 shrink-0 rounded-md border">
            <img
              src={resolveImageURL(item.logoKey || undefined)}
              alt={`${item.name} image`}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <div className="text-md line-clamp-2 leading-tight font-semibold">
            {item.name}
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="line-clamp-4">{item.description}</div>
          <div className="flex items-center justify-between rounded-xl bg-[#F8FAFB] px-4 py-2">
            <div className="text-sm font-medium text-[#99A1AF] uppercase">
              seeking:
            </div>
            <Badge className="pointer-events-none bg-white text-[#2F6FE4]">
              {item.totalRoles} ROLES
            </Badge>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex w-full items-center justify-between text-xs text-[#9EACC0]">
          <div className="flex items-center gap-1.75">
            <Eye size={14} />
            <div className="font-semibold">{item.totalView} Views</div>
          </div>
          <div className="flex items-center gap-1.75">
            <div>Application close:</div>
            <div>{formatDate(item.deadline)}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
