import { MapPin, Share2, Heart, Eye } from "lucide-react";
import { Card } from "~/components/ui/card";

import IconButton from "~/components/icon-button";
import {} from "~/components/ui/skeleton";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import type { LaunchpadOpportunity } from "~/services/launchpad/types/project";

interface LaunchpadProjectCardProps {
  item: LaunchpadOpportunity;
  onOpenOpportunity: (opportunity: LaunchpadOpportunity) => void;
}

export default function LaunchpadProjectCard({
  item,
  onOpenOpportunity,
}: LaunchpadProjectCardProps) {
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
      className="cursor-pointer flex h-95 flex-col p-5 rounded-2xl bg-white transition-all hover:shadow-lg hover:-translate-y-0.5"
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
      <div className="flex items-center gap-3.5 pb-6">
        <div className="size-12.25 rounded-md border">
          <img
            src={item.image}
            alt={`${item.name} image`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="text-md leading-0 font-semibold ">{item.name}</div>
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div>{item.description}</div>
        <div className="rounded-xl px-4 py-2 flex justify-between items-center bg-[#F8FAFB]">
          <div className="text-sm text-[#99A1AF] uppercase font-medium">
            seeking:
          </div>
          <Badge variant="outline" className="text-[#2F6FE4] bg-white">
            {item.teamSize} ROLES
          </Badge>
        </div>
      </div>
      <Separator className="my-6" />
      <div className="w-full flex items-center justify-between text-[#9EACC0] text-xs">
        <div className="flex gap-1.75 items-center">
          <Eye size={14} />
          <div className="font-semibold">{item.views} Views</div>
        </div>
        <div className="flex items-center gap-1.75">
          <div>Application close:</div>
          <div>{item.applicationClose}</div>
        </div>
      </div>
    </Card>
  );
}
