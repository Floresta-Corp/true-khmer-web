import { Globe, Mail, MapPin, Phone, Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import DetailPanel from "~/features/admin/components/detail-panel";
import DetailRow from "~/features/admin/components/detail-row";
import { resolveImageURL } from "~/lib/utils";
import type { AdminVolunteerPostDetailResponse } from "~/types/api-client";

type Organizer = AdminVolunteerPostDetailResponse["organizer"];

export default function ManageVolunteerOrganizerPanel({
  organizer,
}: {
  organizer: Organizer;
}) {
  const { contact } = organizer;

  const contacts = [
    contact.email && {
      icon: <Mail size={13} />,
      label: "Email",
      value: contact.email,
    },
    contact.phone && {
      icon: <Phone size={13} />,
      label: "Phone",
      value: contact.phone,
    },
    contact.telegramUsername && {
      icon: <Send size={13} />,
      label: "Telegram",
      value: contact.telegramUsername,
    },
    contact.websiteUrl && {
      icon: <Globe size={13} />,
      label: "Website",
      value: contact.websiteUrl,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
  }[];

  return (
    <DetailPanel title="Organizer">
      <div className="flex items-center gap-2.5">
        <Avatar className="size-9 shrink-0 border border-slate-100 dark:border-slate-800">
          <AvatarImage
            src={resolveImageURL(organizer.avatarKey)}
            alt={organizer.name}
            className="object-cover"
          />
          <AvatarFallback className="text-xs">
            {organizer.name.trim().charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
            {organizer.name}
          </p>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">
            {organizer.opportunityCount} opportunit
            {organizer.opportunityCount === 1 ? "y" : "ies"} posted
          </p>
        </div>
      </div>

      {organizer.organizerLocation && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <MapPin size={12} className="text-slate-400" />
          {organizer.organizerLocation.name}
        </p>
      )}

      {contacts.length > 0 && (
        <div className="mt-3 divide-y divide-slate-100 border-t border-slate-100 dark:divide-slate-800 dark:border-slate-800">
          {contacts.map((item) => (
            <DetailRow
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>
      )}
    </DetailPanel>
  );
}
