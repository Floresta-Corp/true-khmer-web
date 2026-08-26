import { useState } from "react";
import { Form, useActionData, useNavigation } from "react-router";
import { LockKeyhole, Mail } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FormError } from "~/routes/auth/components/form-error";
import { ResetFlowShell } from "~/routes/auth/components/reset-flow-shell";
import {
  action as forgotPasswordAction,
  loader as forgotPasswordLoader,
} from "~/routes/auth/domain/forgot-password.server";
import type { ForgotPasswordActionData } from "~/routes/auth/domain/auth.types";

export const loader = forgotPasswordLoader;
export const action = forgotPasswordAction;

export function meta() {
  return [{ title: "Forgot Password | True Khmer" }];
}

export default function ForgotPasswordPage() {
  const actionData = useActionData<ForgotPasswordActionData>();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  const isSubmitting = navigation.state === "submitting";
  const canSubmit = email.trim() !== "" && !isSubmitting;

  return (
    <ResetFlowShell
      icon={LockKeyhole}
      title="Forgot Password?"
      description="A code will be sent to your email to help reset password"
    >
      <Form method="post" className="w-full space-y-6">
        <FormError message={actionData?.errors?.form} />

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="block text-[13px] leading-[19.5px] font-semibold text-[#364153]"
          >
            Email address
          </Label>
          <div className="relative">
            <Mail
              size={16}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#899CC9]"
            />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="h-12 rounded-xl border-[#DCEBFE] bg-white py-3 pr-4 pl-11 text-sm text-[#2E3139] placeholder:text-[#899CC9] focus-visible:border-[#2F6FE4] focus-visible:ring-2 focus-visible:ring-[#2F6FE4]/15 focus-visible:ring-offset-0"
            />
          </div>
          {actionData?.errors?.email ? (
            <p className="text-xs text-red-500">{actionData.errors.email}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={!canSubmit}
          className="h-10 w-full rounded-lg bg-[#2F6FE4] text-sm font-medium text-white hover:bg-[#1F62DF] disabled:bg-[#E5EEFf] disabled:text-[#8DA7D6]"
        >
          {isSubmitting ? "Sending reset link..." : "Reset password"}
        </Button>
      </Form>
    </ResetFlowShell>
  );
}
