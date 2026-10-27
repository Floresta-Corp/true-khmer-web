import { Label } from "~/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/routes/auth/components/input-otp";

export function OtpCodeField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-[#1A2233]">
        Verification code
      </Label>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={onChange}
        containerClassName="w-full"
      >
        <InputOTPGroup className="w-full justify-between">
          {Array.from({ length: 6 }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="size-11 rounded-lg border border-[#E5EAF2] bg-white text-lg font-semibold text-[#1A2233] tabular-nums first:rounded-lg first:border-l last:rounded-lg data-[active=true]:border-[#2F6FE4] data-[active=true]:ring-3 data-[active=true]:ring-[#2F6FE4]/15 sm:size-12"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
