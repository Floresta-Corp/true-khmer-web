import {
  Shield,
  Globe,
  Users,
  MapPin,
  Info,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import type { VolunteerPost } from "~/lib/post";

interface OrganizerCardProps {
  volunteer: VolunteerPost;
}

export default function OrganizerCard({ volunteer }: OrganizerCardProps) {
  return (
    <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
      <OrganizerHeader volunteer={volunteer} />
      <OrganizerDetails volunteer={volunteer} />
      <ContactSection />
    </article>
  );
}

interface OrganizerHeaderProps {
  volunteer: VolunteerPost;
}

function OrganizerHeader({ volunteer }: OrganizerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <div className="size-12.25 rounded-2xl border border-[#f3f4f6] bg-[#f9fafb]" />
        <div>
          <p className="flex items-center gap-1.5 text-lg font-semibold text-[#030213]">
            {volunteer?.createdBy.profile.name ?? "User Profile Name"}
            <Shield className="size-3.5 text-[#2f6fe4]" />
          </p>
          <p className="text-[13px] font-medium uppercase tracking-[1.22px] text-[#6a7282]">
            {volunteer?.createdBy.profile.status ?? "Premium Partner"}
          </p>
        </div>
      </div>
      <Button className="h-9 bg-[#2f6fe4] px-4 text-sm font-medium text-[#f8fafc] hover:bg-[#245fca]">
        View Profile
      </Button>
    </div>
  );
}

interface OrganizerDetailsProps {
  volunteer: VolunteerPost;
}

function OrganizerDetails({ volunteer }: OrganizerDetailsProps) {
  return (
    <div className="mt-5.5 grid gap-5.25 border-t border-[#f9fafb] pt-5.5 text-[13px] font-medium text-[#4a5565] sm:grid-cols-3">
      <p className="flex items-center gap-2.5">
        <Globe className="size-3.5" />
        {volunteer?.createdBy.details.website ?? "khmerheritage.org"}
      </p>
      <p className="flex items-center gap-2.5">
        <Users className="size-3.5" />
        {volunteer?.createdBy.details.opportunitiesCount ?? "10+"} Opportunities
      </p>
      <p className="flex items-center gap-2.5">
        <MapPin className="size-3.5" />
        {volunteer?.createdBy.details.location ?? "Phnom Penh"}
      </p>
    </div>
  );
}

function ContactSection() {
  return (
    <div className="mt-7 flex flex-col gap-3 rounded-xl border border-[#f3f4f6] bg-[#f9fafb] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-[#6a7282]">
        <span className="mr-2 inline-flex items-center gap-1 text-[#030213]">
          <Info className="size-3.5" /> Have questions?
        </span>
        Contact the organizer directly for more details about this role.
      </p>
      <Button
        variant="outline"
        className="h-8 rounded-lg border-[#d9e2ef] bg-white px-3 text-[12px] font-medium text-[#2f6fe4]"
      >
        <Mail className="size-3.5" />
        Contact Organizer
        <ChevronDown className="size-3" />
      </Button>
    </div>
  );
}
