import { Mail, Phone, Send } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { Input } from "~/components/ui/input";
import type { VolunteerPostPage2Errors } from "../volunteer-post-page-2";
import type { FormDataVolunteerInput } from "~/features/volunteer/types";

interface PaleInputProps {
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  ariaInvalid?: boolean;
}

function PaleInput({
  placeholder,
  type = "text",
  value,
  onChange,
  className = "",
  ariaInvalid = false,
}: PaleInputProps) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChange(e.target.value)
      }
      aria-invalid={ariaInvalid}
      className={`h-11 rounded-lg border bg-[#f8fafc] px-4 text-sm text-[#364153] placeholder:text-[#c8d6e5] focus-visible:ring-2 ${
        ariaInvalid
          ? "border-red-500 ring-2 ring-red-200 focus-visible:ring-red-500 focus-visible:border-red-500"
          : "border-transparent focus-visible:ring-blue-500/45 focus-visible:border-blue-500/45"
      } ${className}`}
    />
  );
}

interface ContactDetailsFormProps {
  contact: FormDataVolunteerInput["contact"];
  errors?: VolunteerPostPage2Errors["contact"];
  onUpdateField: (
    field: keyof FormDataVolunteerInput["contact"],
    value: string | null,
  ) => void;
}

export default function ContactDetailsForm({
  contact,
  errors,
  onUpdateField,
}: ContactDetailsFormProps) {
  const hasErrors = errors?.phone || errors?.email || errors?.telegramUsername;

  return (
    <section className="rounded-2xl border border-[#E1E7EF] bg-white p-6">
      <div className="flex items-center gap-3">
        <Mail className="size-6 text-[#2f6fe4]" />
        <h3 className="text-[22px] font-bold leading-8.25 text-[#344256]">
          Contact Details
        </h3>
      </div>

      <div className="mt-5 border-t border-[#F3F4F6]" />

      <div
        className="grid gap-7 pt-5 md:grid-cols-2"
        data-contact-error={hasErrors ? "true" : undefined}
      >
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[13px] font-semibold text-[#364153]">
            <Phone className="size-3.5 text-[#00BC7D]" />
            Phone number
            <span className="text-[#e12f3f]">*</span>
          </label>
          <InputGroup className="h-11 rounded-lg has-[[data-slot=input-group-control]:focus-visible]:ring-blue-500/45 has-[[data-slot=input-group-control]:focus-visible]:border-blue-500/45">
            <InputGroupAddon className="bg-[#f8fafc] border-r border-[#e1e7ef] pr-3">
              <span className="text-[14px] font-medium text-[#434654]">
                +855
              </span>
            </InputGroupAddon>
            <InputGroupInput
              type="tel"
              placeholder="12 345 678"
              value={contact.phone ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdateField("phone", e.target.value || null)
              }
              aria-invalid={Boolean(errors?.phone)}
              className="text-[14px] font-medium text-[#364153] placeholder:text-[#c8d6e5]"
            />
          </InputGroup>
          {errors?.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[13px] font-semibold text-[#364153]">
            <Mail className="size-3.5 text-[#ef4444]" />
            Email address
            <span className="text-[#e12f3f]">*</span>
          </label>
          <PaleInput
            placeholder="virak.hou@impactkhmer.com"
            value={contact.email}
            onChange={(value: string) => onUpdateField("email", value)}
            aria-invalid={Boolean(errors?.email)}
          />
          {errors?.email && (
            <p className="text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="flex items-center gap-2 text-[13px] font-semibold text-[#364153]">
            <Send className="size-3.5 text-[#2f6fe4]" />
            Telegram username (optional)
          </label>
          <PaleInput
            placeholder="@virak_hou"
            value={contact.telegramUsername ?? ""}
            onChange={(value: string) =>
              onUpdateField("telegramUsername", value || null)
            }
            aria-invalid={Boolean(errors?.telegramUsername)}
          />
          {errors?.telegramUsername && (
            <p className="text-xs text-red-500">{errors.telegramUsername}</p>
          )}
        </div>
      </div>
    </section>
  );
}
