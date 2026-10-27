import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

// Shared frame for the 2FA setup pages. The form column is kept narrow so
// inputs, the OTP boxes and the action buttons share the same edges.
export function TwoFASetupLayout({
  title,
  description,
  step,
  children,
}: {
  title: string;
  description: string;
  step?: { current: number; total: number; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <Link
        to="/settings/2fa"
        className="inline-flex items-center gap-2 text-sm text-[#6B7A99] transition-colors hover:text-[#344256]"
      >
        <ArrowLeft className="size-4" />
        Back to 2-step verification
      </Link>

      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold text-[#1A2233]">{title}</h2>
        <p className="text-sm leading-5 text-[#6B7A99]">{description}</p>
      </div>

      <div className="w-full max-w-sm space-y-6">
        {step ? (
          <div className="space-y-2">
            <div className="flex gap-1.5">
              {Array.from({ length: step.total }).map((_, index) => (
                <span
                  key={index}
                  className={`h-1 flex-1 rounded-full ${
                    index < step.current ? "bg-[#2F6FE4]" : "bg-[#E5EAF2]"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs font-semibold text-[#6B7A99]">
              Step {step.current} of {step.total}
              <span className="text-[#1A2233]"> · {step.label}</span>
            </p>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export function SetupActions({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 pt-2">{children}</div>;
}
