import { Mail } from "lucide-react";
import FieldLabel from "~/components/field-label";
import SectionInputCard from "~/components/section-input-card";
import { Input } from "~/components/ui/input";

interface LaunchpadContactDetailCardProps {
  email: string;
  phoneNumber: string;
  telegramUsername: string;
  emailError?: string;
  phoneNumberError?: string;
  onEmailChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
  onTelegramUsernameChange: (value: string) => void;
}

export default function LaunchpadContactDetailCard({
  email,
  phoneNumber,
  telegramUsername,
  emailError,
  phoneNumberError,
  onEmailChange,
  onPhoneNumberChange,
  onTelegramUsernameChange,
}: LaunchpadContactDetailCardProps) {
  return (
    <SectionInputCard
      header={{
        title: "Contact Details",
        icon: <Mail size={24} className="text-blue-500" />,
        required: true,
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel>Email address</FieldLabel>
          <Input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(emailError)}
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
          {emailError ? (
            <p className="text-xs text-red-500">{emailError}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <FieldLabel>Phone number</FieldLabel>
          <Input
            value={phoneNumber}
            onChange={(event) => onPhoneNumberChange(event.target.value)}
            placeholder="+855 xx xxx xxx"
            aria-invalid={Boolean(phoneNumberError)}
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
          {phoneNumberError ? (
            <p className="text-xs text-red-500">{phoneNumberError}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>Telegram username (optional)</FieldLabel>
        <Input
          value={telegramUsername}
          onChange={(event) => onTelegramUsernameChange(event.target.value)}
          placeholder="@username"
          className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
        />
      </div>
    </SectionInputCard>
  );
}
