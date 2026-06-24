import { useState } from "react";
import { Lock, UserRound } from "lucide-react";
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { FormError } from "~/routes/auth/components/form-error";
import { PasswordField } from "~/routes/auth/components/password-field";
import { ResetFlowShell } from "~/routes/auth/components/reset-flow-shell";
import {
  acceptInviteAction,
  type AcceptInviteActionData,
} from "../service/accept-invite.action";

export const action = acceptInviteAction;

export function meta() {
  return [{ title: "Create Moderator Account | True Khmer" }];
}

export default function AcceptInvitePage() {
  const actionData = useActionData<AcceptInviteActionData>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isSubmitting = navigation.state === "submitting";
  const canSubmit =
    token !== "" &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    !isSubmitting;

  return (
    <ResetFlowShell
      icon={UserRound}
      title="Create Account"
      description="Set up your moderator account to accept the invitation."
      backTo="/tk-admin/login"
      backLabel="Back to admin sign in"
    >
      <Form method="post" className="w-full space-y-6">
        <input type="hidden" name="token" value={token} />

        <FormError message={actionData?.errors?.form} />

        {!token ? (
          <p className="text-center text-sm text-red-500">
            Your invitation link is missing or invalid. Please ask an admin to
            send a new invite.
          </p>
        ) : null}

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="block text-xs font-semibold text-slate-500"
                >
                  First name
                </Label>
                <div className="relative w-full">
                  <UserRound
                    size={14}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#899CC9]"
                  />
                  <Input
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    autoComplete="given-name"
                    placeholder="Enter your first name.."
                    className="h-12 w-full rounded-xl border-[#DCEBFE] bg-white py-3 pl-11 pr-4 text-sm text-[#2E3139] placeholder:text-[#899CC9] focus-visible:border-[#2F6FE4] focus-visible:ring-2 focus-visible:ring-[#2F6FE4]/15 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="block text-xs font-semibold text-slate-500"
                >
                  Last name
                </Label>
                <div className="relative w-full">
                  <UserRound
                    size={14}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#899CC9]"
                  />
                  <Input
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    autoComplete="family-name"
                    placeholder="Enter your last name.."
                    className="h-12 w-full rounded-xl border-[#DCEBFE] bg-white py-3 pl-11 pr-4 text-sm text-[#2E3139] placeholder:text-[#899CC9] focus-visible:border-[#2F6FE4] focus-visible:ring-2 focus-visible:ring-[#2F6FE4]/15 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </div>

            {actionData?.errors?.name ? (
              <p className="text-xs text-red-500 mt-1">
                {actionData.errors.name}
              </p>
            ) : null}
          </div>

          <PasswordField
            id="password"
            name="password"
            label="Password"
            icon={Lock}
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••••••••••"
            error={actionData?.errors?.password}
            labelClassName="text-xs font-semibold leading-4 text-[#2E3139]"
            inputClassName="h-12 rounded-xl border-[#DCEBFE] bg-white py-3 pl-11 pr-11 text-sm text-[#2E3139] placeholder:text-[#899CC9] focus-visible:border-[#2F6FE4] focus-visible:ring-2 focus-visible:ring-[#2F6FE4]/15 focus-visible:ring-offset-0"
            iconClassName="left-4 text-[#899CC9]"
            toggleClassName="right-2 h-8 w-8 text-[#899CC9] hover:text-[#6F86B3]"
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm password"
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
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </Form>
    </ResetFlowShell>
  );
}
