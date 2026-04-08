import { Info } from "lucide-react";
import { Button } from "~/components/ui/button";
import VolunteerApplicationDialog from "../dialog/volunteer-application-dialog";
import type { VolunteerPost } from "~/lib/post";

interface Role {
  id: number;
  title: string;
  commitment: string;
  spotLeft: number;
  responsibilities: string[];
  requirements: string[];
}

interface ApplicationSummaryProps {
  volunteer: VolunteerPost;
  role: Role;
}

export default function ApplicationSummary({
  volunteer,
  role,
}: ApplicationSummaryProps) {
  return (
    <aside className="h-fit rounded-[14px] border border-[#e1e7ef] bg-white p-8 xl:sticky xl:top-24">
      <h2 className="text-lg font-semibold tracking-[-0.44px] text-[#030213]">
        Application Summary
      </h2>

      <SummaryDetails volunteer={volunteer} />
      <ActionButtons role={role} />
      <InfoBox />

      <p className="mt-4 text-[11px] font-medium text-[#99a1af]">
        Opportunity ID: {volunteer.id ?? "1"}
      </p>
    </aside>
  );
}

interface SummaryDetailsProps {
  volunteer: VolunteerPost;
}

function SummaryDetails({ volunteer }: SummaryDetailsProps) {
  return (
    <div className="mt-6 space-y-3.5 border-b border-[#f9fafb] pb-6 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-[#99a1af]">Applicants</span>
        <span className="font-semibold text-[#4a5565]">
          {(volunteer?.totalApplicants ?? 10) - (volunteer?.applicants ?? 7)}{" "}
          spots open
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#99a1af]">Deadline</span>
        <span className="font-semibold text-[#4a5565]">
          {volunteer?.deadline ?? "Dec 15, 2026"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#99a1af]">Commitment</span>
        <span className="font-semibold text-[#4a5565]">
          {volunteer?.commitment ?? "Full week"}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[#99a1af]">Duration</span>
        <span className="font-semibold text-[#4a5565]">
          {volunteer?.duration ?? "1 week"}
        </span>
      </div>
    </div>
  );
}

interface ActionButtonsProps {
  role: Role;
}

function ActionButtons({ role }: ActionButtonsProps) {
  return (
    <div className="mt-6 space-y-3.5">
      <VolunteerApplicationDialog role={role} />
      <Button variant="outline" className="h-10 w-full text-sm font-medium">
        Save for Later
      </Button>
    </div>
  );
}

function InfoBox() {
  return (
    <div className="mt-6 rounded-xl border border-[#f3f4f6] bg-[#f9fafb] px-3.5 py-3 text-[11px] font-medium leading-4.25 text-[#6a7282]">
      <p className="flex items-start gap-2">
        <Info className="mt-0.5 size-3.5 shrink-0 text-[#9eacc0]" />
        Our team will review your application and contact you for a brief
        interview.
      </p>
    </div>
  );
}
