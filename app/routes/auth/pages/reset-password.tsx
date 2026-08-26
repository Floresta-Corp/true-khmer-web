import { useState } from "react";
import { Lock } from "lucide-react";
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { Button } from "~/components/ui/button";
import { FormError } from "~/routes/auth/components/form-error";
import { PasswordField } from "~/routes/auth/components/password-field";
import { ResetFlowShell } from "~/routes/auth/components/reset-flow-shell";
import { action as resetPasswordAction } from "~/routes/auth/domain/reset-password.server";
import type { ResetPasswordActionData } from "~/routes/auth/domain/auth.types";

export const action = resetPasswordAction;

export function meta() {
  return [{ title: "Set New Password | True Khmer" }];
}

export default function ResetPasswordPage() {
  const actionData = useActionData<ResetPasswordActionData>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isSubmitting = navigation.state === "submitting";
  const canSubmit =
    token !== "" &&
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    !isSubmitting;

  return (
    <ResetFlowShell
      icon={Lock}
      title="Set New Password"
      description="Enter your new password to complete the reset process"
      backLabel="Back to sign in"
    >
      <Form method="post" className="w-full space-y-6">
        <input type="hidden" name="token" value={token} />

        <FormError message={actionData?.errors?.form} />

        {!token ? (
          <p className="text-center text-sm text-red-500">
            Your reset link is missing or invalid. Please request a new one.
          </p>
        ) : null}

        <div className="space-y-4">
          <PasswordField
            id="newPassword"
            name="newPassword"
            label="New password"
            icon={Lock}
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="••••••••••••••••"
            error={actionData?.errors?.newPassword}
            labelClassName="text-xs font-semibold leading-4 text-[#2E3139]"
            inputClassName="h-12 rounded-xl border-[#DCEBFE] bg-white py-3 pl-11 pr-11 text-sm text-[#2E3139] placeholder:text-[#899CC9] focus-visible:border-[#2F6FE4] focus-visible:ring-2 focus-visible:ring-[#2F6FE4]/15 focus-visible:ring-offset-0"
            iconClassName="left-4 text-[#899CC9]"
            toggleClassName="right-2 h-8 w-8 text-[#899CC9] hover:text-[#6F86B3]"
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm new password"
            icon={Lock}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="••••••••••••••••"
            error={actionData?.errors?.confirmPassword}
            labelClassName="text-xs font-semibold leading-4 text-[#2E3139]"
            inputClassName="h-12 rounded-xl border-[#DCEBFE] bg-white py-3 pl-11 pr-11 text-sm text-[#2E3139] placeholder:text-[#899CC9] focus-visible:border-[#2F6FE4] focus-visible:ring-2 focus-visible:ring-[#2F6FE4]/15 focus-visible:ring-offset-0"
            iconClassName="left-4 text-[#899CC9]"
            toggleClassName="right-2 h-8 w-8 text-[#899CC9] hover:text-[#6F86B3]"
          />
        </div>

        {actionData?.errors?.token ? (
          <p className="text-center text-xs text-red-500">
            {actionData.errors.token}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={!canSubmit}
          className="h-10 w-full rounded-lg bg-[#2F6FE4] text-sm font-medium text-white hover:bg-[#1F62DF] disabled:bg-[#E5EEFF] disabled:text-[#8DA7D6]"
        >
          {isSubmitting ? "Setting new password..." : "Set new password"}
        </Button>
      </Form>
    </ResetFlowShell>
  );
}
