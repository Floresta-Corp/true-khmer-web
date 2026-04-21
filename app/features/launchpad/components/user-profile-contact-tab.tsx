import { Globe, Info, Mail, Phone, Send } from "lucide-react";

function ContactField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex w-full flex-col gap-1.75">
      <div className="flex h-[19.5px] items-center gap-1.75 pl-[3.5px]">
        <span className="text-[#364153]">{icon}</span>
        <p className="text-[13px] font-semibold leading-[19.5px] text-[#364153]">
          {label}
        </p>
      </div>

      <div className="flex h-[50.6px] items-center rounded-[14px] bg-[#f8fafc] px-[17.5px] py-3.5">
        <p className="text-[14px] font-medium text-[#c8d6e5]">{value}</p>
      </div>
    </div>
  );
}

export default function UserProfileContactTab() {
  return (
    <div className="flex w-full flex-col gap-3.5">
      <div className="flex w-full flex-col gap-3.5 xl:flex-row xl:items-center xl:gap-7">
        <ContactField
          icon={<Send className="size-3.5" />}
          label="Telegram username"
          value="@virak_hou"
        />
        <ContactField
          icon={<Mail className="size-3.5" />}
          label="Email address"
          value="virak.hou@impactkhmer.com"
        />
      </div>

      <div className="flex w-full flex-col gap-3.5 xl:flex-row xl:items-center xl:gap-7">
        <ContactField
          icon={<Phone className="size-3.5" />}
          label="Phone number (optional)"
          value="+855 12 345 678"
        />
        <ContactField
          icon={<Globe className="size-3.5" />}
          label="Website or link"
          value="https://truekhmer.org"
        />
      </div>

      <div className="flex min-h-9.25 items-center rounded-2xl border border-[#d5edff] bg-[#f4f8ff] px-[10.5px] py-[10.3px]">
        <Info className="mr-1.75 size-[12.25px] text-[#2f6fe4]" />
        <p className="text-[12px] font-semibold leading-4.5 text-[#2f6fe4]">
          Using verified contact details from your True Khmer profile.
        </p>
      </div>
    </div>
  );
}
