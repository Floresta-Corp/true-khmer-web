import { ChevronUp, Mail, Phone, Send } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import type { Candidate } from "~/services/manage-post/types";

type Props = {
  candidate: Candidate;
};

type ContactItemProps = {
  href?: string;
  icon: ReactNode;
  label: string;
  value?: string | null;
  external?: boolean;
  iconClassName?: string;
};

function ContactItem({
  href,
  icon,
  label,
  value,
  external,
  iconClassName,
}: ContactItemProps) {
  const isAvailable = Boolean(href && value);
  const content = (
    <>
      <span className={cn("mt-1 shrink-0 text-[#8A95A6]", iconClassName)}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[9px] font-semibold leading-3 text-[#99A1AF]">
          {label}
        </span>
        <span
          className={cn(
            "block truncate text-xs font-bold leading-4",
            isAvailable ? "text-[#344256]" : "text-[#99A1AF]",
          )}
        >
          {value || "Not provided"}
        </span>
      </span>
    </>
  );

  if (!isAvailable) {
    return (
      <div className="flex items-start gap-3 border-b border-[#F0F2F5] px-4 py-3 last:border-b-0">
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-start gap-3 border-b border-[#F0F2F5] px-4 py-3 transition-colors last:border-b-0 hover:bg-[#F8FAFC]"
    >
      {content}
    </a>
  );
}

export default function ApplicantContactPopover({ candidate }: Props) {
  const telegramUsername = candidate.telegramUsername?.replace("@", "");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-11 w-full cursor-pointer rounded-xl border-blue-500 bg-white text-sm font-bold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        >
          <Mail className="size-4" />
          Contact
          <ChevronUp className="size-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        sideOffset={12}
        className="w-56.5 gap-0 overflow-hidden rounded-xl border border-[#EEF1F5] bg-white p-0 shadow-lg ring-0"
      >
        <div className="border-b border-[#F0F2F5] bg-[#F8FAFC] px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#99A1AF]">
          Available Contacts
        </div>
        <ContactItem
          href={`mailto:${candidate.email}`}
          icon={<Mail className="size-4" />}
          label="Email"
          value={candidate.email}
        />
        <ContactItem
          href={
            telegramUsername ? `https://t.me/${telegramUsername}` : undefined
          }
          icon={<Send className="size-4" />}
          label="Telegram"
          value={candidate.telegramUsername}
          external
          iconClassName="text-blue-500"
        />
        <ContactItem
          href={
            candidate.phoneNumber ? `tel:${candidate.phoneNumber}` : undefined
          }
          icon={<Phone className="size-4" />}
          label="Phone"
          value={candidate.phoneNumber}
          iconClassName="text-emerald-500"
        />
      </PopoverContent>
    </Popover>
  );
}
