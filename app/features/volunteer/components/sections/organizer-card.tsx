import {
  Shield,
  Globe,
  Users,
  MapPin,
  Info,
  Mail,
  ChevronDown,
  Phone,
  MessageCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { resolveImageURL } from "~/lib/utils";
import type {
  Opportunity,
  Organizer,
} from "~/services/volunteer/types/opportunities";

interface OrganizerCardProps {
  volunteer: Opportunity;
}

export default function OrganizerCard({ volunteer }: OrganizerCardProps) {
  return (
    <article className="rounded-[14px] border border-[#e1e7ef] bg-white p-8">
      <OrganizerHeader organizer={volunteer.organizer} />
      <OrganizerDetails organizer={volunteer.organizer} />
      <ContactSection organizer={volunteer.organizer} />
    </article>
  );
}

interface OrganizerHeaderProps {
  organizer: Organizer;
}

function OrganizerHeader({ organizer }: OrganizerHeaderProps) {
  const image = resolveImageURL(
    organizer.avatarUrl ?? undefined,
    "/avatar_placeholder.webp",
  );
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <img
          className="size-12.25 rounded-2xl border border-[#f3f4f6] bg-[#f9fafb] object-cover"
          src={image}
          alt={organizer.name || "Organizer avatar"}
        />
        <div>
          <p className="flex items-center gap-1.5 text-lg font-semibold text-[#030213]">
            {organizer.name ?? "User Profile Name"}
            <Shield className="size-3.5 text-[#2f6fe4]" />
          </p>
          <p className="text-[13px] font-medium uppercase tracking-[1.22px] text-[#6a7282]">
            ORGANIZER
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
  organizer: Organizer;
}

function OrganizerDetails({ organizer }: OrganizerDetailsProps) {
  return (
    <div className="mt-5.5 grid gap-5.25 border-t border-[#f9fafb] pt-5.5 text-[13px] font-medium text-[#4a5565] sm:grid-cols-3">
      {organizer.contact.phone && (
        <p className="flex items-center gap-2.5">
          <Phone className="size-3.5" />
          +855 {organizer.contact.phone ?? ""}
        </p>
      )}
      <p className="flex items-center gap-2.5">
        <Users className="size-3.5" />
        {organizer.opportunityCount ?? "10+"} Opportunities
      </p>
      <p className="flex items-center gap-2.5">
        <MapPin className="size-3.5" />
        {organizer.organizerLocation ?? "Phnom Penh"}
      </p>
    </div>
  );
}

function ContactSection({ organizer }: { organizer: Organizer }) {
  const contact = organizer.contact;
  return (
    <div className="mt-7 flex flex-col gap-3 rounded-xl border border-[#f3f4f6] bg-[#f9fafb] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-[#6a7282]">
        <span className="mr-2 inline-flex items-center gap-1 text-[#030213]">
          <Info className="size-3.5" /> Have questions?
        </span>
        Contact the organizer directly for more details about this role.
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-8 rounded-lg border-[#d9e2ef] bg-white px-3 text-[12px] font-medium text-[#2f6fe4]"
          >
            <Mail className="size-3.5" />
            Contact Organizer
            <ChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {contact.phone && (
            <DropdownMenuItem asChild>
              <a
                href={`tel:+855${contact.phone}`}
                className="flex items-center gap-2"
              >
                <Phone className="size-3.5" />
                +855 {contact.phone}
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-2"
            >
              <Mail className="size-3.5" />
              {contact.email}
            </a>
          </DropdownMenuItem>
          {contact.telegramUsername && (
            <DropdownMenuItem asChild>
              <a
                href={`https://t.me/${contact.telegramUsername.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="size-3.5" />
                {contact.telegramUsername}
              </a>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
