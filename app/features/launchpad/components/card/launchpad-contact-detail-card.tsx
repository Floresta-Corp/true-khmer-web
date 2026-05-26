import { Mail } from "lucide-react";
import { useId } from "react";
import FieldLabel from "~/components/field-label";
import SectionInputCard from "~/components/section-input-card";
import { Input } from "~/components/ui/input";

interface LaunchpadContactDetailCardProps {
  email: string;
  phoneNumber: string;
  telegramUsername: string;
  emailError?: string;
  phoneNumberError?: string;
  telegramUsernameError?: string;
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
  telegramUsernameError,
  onEmailChange,
  onPhoneNumberChange,
  onTelegramUsernameChange,
}: LaunchpadContactDetailCardProps) {
  const emailErrorId = useId();
  const phoneErrorId = useId();
  const telegramErrorId = useId();

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
          <FieldLabel required>Email address</FieldLabel>
          <Input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder="you@example.com"
            aria-invalid={Boolean(emailError)}
            aria-describedby={emailError ? emailErrorId : undefined}
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
          {emailError ? (
            <p id={emailErrorId} className="text-xs text-red-500">
              {emailError}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <FieldLabel required>Phone number</FieldLabel>
          <Input
            value={phoneNumber}
            onChange={(event) => onPhoneNumberChange(event.target.value)}
            placeholder="+855 xx xxx xxx"
            aria-invalid={Boolean(phoneNumberError)}
            aria-describedby={phoneNumberError ? phoneErrorId : undefined}
            className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
          />
          {phoneNumberError ? (
            <p id={phoneErrorId} className="text-xs text-red-500">
              {phoneNumberError}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>Telegram username (optional)</FieldLabel>
        <Input
          value={telegramUsername}
          onChange={(event) => onTelegramUsernameChange(event.target.value)}
          placeholder="@username"
          aria-invalid={Boolean(telegramUsernameError)}
          aria-describedby={telegramUsernameError ? telegramErrorId : undefined}
          className="h-12.5 rounded-xl border-none px-4 bg-[#F8FAFC]"
        />
        {telegramUsernameError ? (
          <p id={telegramErrorId} className="text-xs text-red-500">
            {telegramUsernameError}
          </p>
        ) : null}
      </div>
    </SectionInputCard>
  );
}
