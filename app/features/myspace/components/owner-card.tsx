import { Mail, PhoneCall, Send } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

export interface OwnerCardProps {
  avatar: string;
  name: string;
  role: string;
  phone?: string;
  email?: string;
  telegram?: string;
}

function ActionLink({
  href,
  icon,
  bgColor,
  enabled,
}: {
  href?: string;
  icon: React.ReactNode;
  bgColor: string;
  enabled: boolean;
}) {
  if (enabled && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] ${bgColor} text-[#2F6FE4] transition-colors hover:bg-[#DFEBFF]`}
      >
        {icon}
      </a>
    );
  }

  return (
    <button
      type="button"
      disabled
      className={`inline-flex size-8 items-center justify-center rounded-lg border border-[#E7ECF3] ${bgColor} text-[#2F6FE4] opacity-50`}
    >
      {icon}
    </button>
  );
}

export function OwnerCard({
  avatar,
  name,
  role,
  phone,
  email,
  telegram,
}: OwnerCardProps) {
  return (
    <Card className="rounded-[24px] border-[#E7ECF3] bg-white shadow-none">
      <CardContent className="space-y-4 p-5">
        <div className="text-[15px] font-medium text-[#182031]">
          Project Owner
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={avatar}
              alt={name}
              className="size-10 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0">
              <div className="truncate text-[15px] font-semibold text-[#182031]">
                {name}
              </div>
              <div className="text-[12px] text-[#6A7282]">{role}</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ActionLink
              href={telegram}
              icon={<Send className="size-3.5" />}
              bgColor="bg-[#EDF4FF]"
              enabled={!!telegram}
            />
            <ActionLink
              href={phone}
              icon={<PhoneCall className="size-3.5" />}
              bgColor="bg-white"
              enabled={!!phone}
            />
            <ActionLink
              href={email}
              icon={<Mail className="size-3.5" />}
              bgColor="bg-white"
              enabled={!!email}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
