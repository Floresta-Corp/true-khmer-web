import { Mail } from "lucide-react";
import { useSearchParams } from "react-router";
import { ResetFlowShell } from "~/routes/auth/components/reset-flow-shell";

export function meta() {
  return [{ title: "Check Your Email | True Khmer" }];
}

export default function ForgotPasswordCheckEmailPage() {
  const [searchParams] = useSearchParams();
  const message =
    searchParams.get("message") ||
    "We’ve sent a password reset link to your email.";

  return (
    <ResetFlowShell
      icon={Mail}
      title="Check your email"
      description={message}
      descriptionClassName="max-w-[346px] sm:max-w-[420px]"
    >
      <div className="text-center">
        <p className="text-sm leading-5 font-medium text-[#8E8E8E]">
          Did you receive the email?
          <br />
          If not, check your spam folder.
        </p>
      </div>
    </ResetFlowShell>
  );
}
