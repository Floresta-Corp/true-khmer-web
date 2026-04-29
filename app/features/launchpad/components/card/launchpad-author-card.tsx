import { Mail, PhoneCall, Send } from "lucide-react";
import { Card } from "~/components/ui/card";
import { resolveImageURL } from "~/lib/utils";
import type { LaunchpadDetail } from "~/services/launchpad/types/project";

interface LaunchpadAuthorCardProps {
  project: LaunchpadDetail;
}

export default function LaunchpadAuthorCard({
  project,
}: LaunchpadAuthorCardProps) {
  const profileName = project.createdBy.name;
  const profileImage = resolveImageURL(
    project.createdBy.avatarKey || undefined,
  );
  const postedProjects = `${project.createdBy.launchpadCount}+ projects posted`;
  const telegramUrl = project.telegramUsername
    ? `https://t.me/${project.telegramUsername.replace("@", "")}`
    : undefined;
  const contactLink = project.phoneNumber
    ? `tel:${project.phoneNumber}`
    : undefined;
  const emailLink = project.email ? `mailto:${project.email}` : undefined;

  return (
    <Card className="rounded-2xl border-[#E7ECF3] bg-white p-5">
      <div className="mb-4 text-sm font-medium text-[#6A7282]">Posted by</div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={profileImage}
            className="size-11 shrink-0 rounded-full border border-[#E7ECF3] object-cover"
            alt={profileName}
          />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold text-[#0F1729]">
              {profileName}
            </div>
            <div className="text-xs text-[#6A7282]">{postedProjects}</div>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <a
            href={telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] bg-[#EDF4FF] text-[#2F6FE4] transition-colors hover:bg-[#DFEBFF]"
            aria-disabled={!telegramUrl}
          >
            <Send className="size-3.5" />
          </a>
          <a
            href={contactLink}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] bg-white text-[#6A7282] transition-colors hover:bg-[#F8FAFB]"
            aria-disabled={!contactLink}
          >
            <PhoneCall className="size-3.5" />
          </a>
          <a
            href={emailLink}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] bg-white text-[#6A7282] transition-colors hover:bg-[#F8FAFB]"
            aria-disabled={!emailLink}
          >
            <Mail className="size-3.5" />
          </a>
        </div>
      </div>
    </Card>
  );
}
