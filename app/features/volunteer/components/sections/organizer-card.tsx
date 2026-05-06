import { ChevronUp, Globe, Mail, Send, Phone } from "lucide-react";
import { Button } from "~/components/ui/button";
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
    <article className="rounded-[14px] border border-[#e1e7ef] bg-[#F9FAFB] p-4 h-26.5">
      <div className="flex items-center gap-5">
        <OrganizerHeader organizer={volunteer.organizer} />
        <OrganizerActions organizer={volunteer.organizer} />
      </div>
    </article>
  );
}

interface OrganizerHeaderProps {
  organizer: Organizer;
}

function OrganizerHeader({ organizer }: OrganizerHeaderProps) {
  const avatarUrl = resolveImageURL(
    organizer.avatarUrl || undefined,
    "/avatar_placeholer.webp",
  );
  const opportunityCount =
    organizer.opportunityCount > 10
      ? `${organizer.opportunityCount}+`
      : organizer.opportunityCount;
  return (
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-700 mb-3">Posted By</p>
      <div className="">
        <div className="flex h-full gap-3 items-center">
          <img
            src={avatarUrl}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="whitespace-nowrap text-[16px] font-semibold leading-4">
              {organizer.name || "Unknown"}
            </p>
            <span className="whitespace-nowrap text-[12px] font-medium leading-3.75 text-slate-700">
              {organizer.opportunityCount} volunteers posted
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrganizerActions({ organizer }: OrganizerHeaderProps) {
  const telegramUrl = organizer.contact.telegramUsername
    ? `https://t.me/${organizer.contact.telegramUsername.replace("@", "")}`
    : undefined;
  const phoneUrl = organizer.contact.phone
    ? `tel:+855${organizer.contact.phone.replace(/^\+?855/, "")}`
    : undefined;
  const emailUrl = `mailto:${organizer.contact.email}`;

  return (
    <div className="flex items-center gap-3">
      {telegramUrl ? (
        <Button
          asChild
          variant="outline"
          className="size-10 rounded-xl border-[#e1e7ef] bg-white p-0 text-[#0a0a0a] hover:bg-[#f8fafc]"
        >
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
            <Send className="size-4" />
            <span className="sr-only">Telegram</span>
          </a>
        </Button>
      ) : null}

      {phoneUrl ? (
        <Button
          asChild
          variant="outline"
          className="size-10 rounded-xl border-[#e1e7ef] bg-white p-0 text-[#0a0a0a] hover:bg-[#f8fafc]"
        >
          <a href={phoneUrl}>
            <Phone className="size-4" />
            <span className="sr-only">Phone</span>
          </a>
        </Button>
      ) : null}

      <Button
        asChild
        variant="outline"
        className="size-10 rounded-xl border-[#e1e7ef] bg-white p-0 text-[#0a0a0a] hover:bg-[#f8fafc]"
      >
        <a href={emailUrl}>
          <Mail className="size-4" />
          <span className="sr-only">Email</span>
        </a>
      </Button>
    </div>
  );
}
