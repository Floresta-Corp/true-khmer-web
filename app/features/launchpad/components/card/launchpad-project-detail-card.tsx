import { Calendar, Eye, MapPin, Share2 } from "lucide-react";
import IconButton from "~/components/icon-button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

const data = {
  background: "",
  tag: "Web3 Gaming",
  name: "The Etherium Nexus",
  location: "Phnom Penh",
  deadline: "2026-04-12",
  views: 1234,
  projectDetails:
    "The Etherium Nexus is an exciting new Web3 game which immerses players in a naval-inspired virtual world built for competition. \n\n Our mission is to empower the next generation of Khmer creators by providing decentralized infrastructure that scales without compromising on community values. We believe that true impact comes from building tools that are accessible, transparent, and owned by the users themselves.",
};

export default function LaunchpadProjectDetailCard() {
  return (
    <Card className="px-7 py-4 bg-white">
      <div className="flex items-center justify-between">
        <div className="py-1 flex gap-9">
          <div>
            <div className="flex items-center gap-1.75 text-[#9EACC0] pb-1">
              <MapPin className="size-2.5" />
              <div className="text-xs uppercase">Location</div>
            </div>
            <div className="font-semibold">{data.location}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.75 text-[#9EACC0] pb-1">
              <Calendar className="size-2.5" />
              <div className="text-xs uppercase">Deadline</div>
            </div>
            <div className="font-semibold">{data.deadline}</div>
          </div>
          <div>
            <div className="flex items-center gap-1.75 text-[#9EACC0] pb-1">
              <Eye className="size-2.5" />
              <div className="text-xs uppercase">Views</div>
            </div>
            <div className="font-semibold">{data.views} Views</div>
          </div>
        </div>
        <div>
          <IconButton icon={<Share2 className="size-3.5" />} />
        </div>
      </div>
      <Separator className="my-4" />
      <div>
        <div className="font-semibold text-lg mb-3">Project Details</div>
        <p className="text-[13px] leading-5.5 text-[#6A7282]">
          The Etherium Nexus is an exciting new Web3 game which immerses players
          in a naval-inspired virtual world built for competition.
          <br />
          <br />
          Our mission is to empower the next generation of Khmer creators by
          providing decentralized infrastructure that scales without
          compromising on community values. We believe that true impact comes
          from building tools that are accessible, transparent, and owned by the
          users themselves.
        </p>
      </div>
    </Card>
  );
}
