import { Calendar, Clock3, MapPin, Star } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export interface RewardCardProps {
  date: string;
  flexibility: string;
  location: string;
  rewardPoints: number;
}

export function RewardCard({
  date,
  flexibility,
  location,
  rewardPoints,
}: RewardCardProps) {
  return (
    <Card className="rounded-[24px] border-[#E7ECF3] bg-white shadow-none">
      <CardContent className="space-y-4 p-5">
        <div className="rounded-[20px] border border-[#E4EEF9] bg-[#F7FBFF] p-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#2F6FE4] text-white shadow-[0px_12px_24px_-12px_rgba(47,111,228,0.9)]">
            <Star className="size-4.5 fill-current" />
          </div>
          <div className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
            Impact Reward
          </div>
          <div className="text-[22px] font-bold tracking-tight text-[#2F6FE4]">
            {rewardPoints} Points
          </div>
        </div>

        <div className="space-y-3 text-[14px] text-[#5B687D]">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-[#7C8BA1]" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 text-[#7C8BA1]" />
            <span>{flexibility}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-[#7C8BA1]" />
            <span>{location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
