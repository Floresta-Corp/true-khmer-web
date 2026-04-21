import { Users } from "lucide-react";
import { Button } from "~/components/ui/button";

interface CollaborationCardProps {
  data: {
    id: string;
    title: string;
    details: string;
    availableSpot: number;
  };
}

export default function LaunchpadCollaborationCard({
  data,
}: CollaborationCardProps) {
  return (
    <div className="p-4 rounded-lg flex bg-[#F8FAFB] items-center gap-8">
      <div className="size-10.5 bg-[#2f6ee41c] rounded-[14px] flex items-center justify-center">
        <Users className="size-4.25 text-blue-500" />
      </div>
      <div className="text-sm flex-1">
        <div>
          <div className="font-semibold">{data.title}</div>
          <p className="text-[13px] text-[#6A7282]">{data.details}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[#9EACC0] text-xs">Available</div>
        <p className="text-sm text-blue-500 font-semibold">
          {data.availableSpot} Spots
        </p>
      </div>
      <Button className="bg-blue-500 px-3 py-4.5 font-base text-sm">
        Apply
      </Button>
    </div>
  );
}
