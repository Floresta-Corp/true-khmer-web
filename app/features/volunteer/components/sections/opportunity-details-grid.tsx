import { MapPin, Clock3, Calendar, Users } from "lucide-react";
import type { VolunteerPost } from "~/lib/post";

interface OpportunityDetailsGridProps {
  volunteer: VolunteerPost;
}

export default function OpportunityDetailsGrid({
  volunteer,
}: OpportunityDetailsGridProps) {
  return (
    <div className="grid gap-6 border-b border-[#f9fafb] pb-5.5 pt-5.25 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-1">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12px] text-[#99a1af]">
          <MapPin className="size-[10.5px]" /> Location
        </p>
        <p className="text-sm font-semibold text-[#4a5565]">
          {volunteer?.location ?? "Siem Reap"}
        </p>
      </div>
      <div className="space-y-1">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12px] text-[#99a1af]">
          <Clock3 className="size-[10.5px]" /> Commitment
        </p>
        <p className="text-sm font-semibold text-[#4a5565]">
          {volunteer?.commitment ?? "Full week"}
        </p>
      </div>
      <div className="space-y-1">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12px] text-[#99a1af]">
          <Calendar className="size-[10.5px]" /> Duration
        </p>
        <p className="text-sm font-semibold text-[#4a5565]">
          {volunteer?.duration ?? "1 week"}
        </p>
      </div>
      <div className="space-y-1">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.12px] text-[#99a1af]">
          <Users className="size-[10.5px]" /> Applicants
        </p>
        <p className="text-sm font-semibold text-[#4a5565]">
          {volunteer?.applicants ?? 7}/{volunteer?.totalApplicants ?? 10}
        </p>
      </div>
    </div>
  );
}
