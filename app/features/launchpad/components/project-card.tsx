import { MapPin, ArrowUpRight, Share2, Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import type { LaunchpadOpportunity } from "./section/launchpad-available-project-section";
import IconButton from "~/components/icon-button";
import { Skeleton } from "~/components/ui/skeleton";

interface ProjectCardProps {
  item: LaunchpadOpportunity;
  onOpenOpportunity: (opportunity: LaunchpadOpportunity) => void;
}

export default function ProjectCard({
  item,
  onOpenOpportunity,
}: ProjectCardProps) {
  return (
    <Card
      key={item.id}
      role="button"
      tabIndex={0}
      onClick={() => onOpenOpportunity(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenOpportunity(item);
        }
      }}
      className="cursor-pointer h-95 p-5 rounded-2xl shadow-none bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between pb-3">
        <div className="flex gap-1 items-baseline text-blue-500">
          <MapPin className="size-3" />
          <p className="text-sm">{item.location}</p>
        </div>
        <div className="flex gap-2">
          <IconButton icon={<Share2 className="size-3.5" />} />
          <IconButton icon={<Heart className="size-3.5" />} />
        </div>
      </div>
      <div className="pb-6 flex items-center justify-start">
        <div className="size-12.25 rounded-md">
          {<Skeleton className="w-full h-full" />}
        </div>
        <div className="text-md font-semibold">{item.name}</div>
      </div>
      <div className="h-full flex flex-col justify-between">
        <div>{item.name}</div>
      </div>

      <Button
        variant="outline"
        className="h-9 w-full rounded-lg border-[#f1f5f9] bg-white text-sm font-medium text-[#2f6fe4] hover:bg-[#f8faff]"
        onClick={(event) => {
          event.stopPropagation();
          onOpenOpportunity(item);
        }}
      >
        View details
        <ArrowUpRight className="size-4" />
      </Button>
    </Card>
  );
}
