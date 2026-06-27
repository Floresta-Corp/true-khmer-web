import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { Key } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { PasswordField } from "~/routes/auth/components/password-field";
import { getPasswordValidationError } from "~/routes/auth/domain/password-validation";
import { Divider } from "./Divider";
import { SecurityRow } from "./SecurityRow";
import { TwoFactorToggle } from "./TwoFactorToggle";
import type { SettingsActionData } from "../types";

type PasswordErrors = {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

type SubmittedPasswords = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export function SecurityView({
  email,
  setupNewPassword,
  enabled,
  onEdit2FA,
}: {
  email: string;
  setupNewPassword: boolean;
  enabled: boolean;
  onEdit2FA: () => void;
}) {
  const fetcher = useFetcher<SettingsActionData>();
  const [open, setOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientErrors, setClientErrors] = useState<PasswordErrors>({});
  const [submittedPasswords, setSubmittedPasswords] =
    useState<SubmittedPasswords | null>(null);
  const data = fetcher.data;
  const pendingIntent = fetcher.formData?.get("intent")?.toString();
  const isSubmitting =
    fetcher.state !== "idle" && pendingIntent === "change-password";

  useEffect(() => {
    if (data?.ok && data.intent === "change-password") {
      setOpen(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setClientErrors({});
      setSubmittedPasswords(null);
    }
  }, [data]);

  function validatePasswordForm() {
    const errors: PasswordErrors = {};
    const newPasswordError = getPasswordValidationError(newPassword);

    if (!setupNewPassword && !oldPassword) {
      errors.oldPassword = "Current password is required.";
    }
    if (newPasswordError) errors.newPassword = newPasswordError;
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your new password.";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const serverErrors =
    data?.intent === "change-password" &&
    submittedPasswords?.oldPassword === oldPassword &&
    submittedPasswords.newPassword === newPassword &&
    submittedPasswords.confirmPassword === confirmPassword
      ? data.errors
      : undefined;
  const liveConfirmPasswordError =
    newPassword && confirmPassword && newPassword !== confirmPassword
      ? "Passwords do not match."
      : undefined;
  const successMessage =
    data?.ok && data.intent === "change-password" ? data.message : undefined;

  return (
    <div className="space-y-10">
      <h2 className="text-2xl font-bold text-[#1A2233]">Account Security</h2>

      {successMessage ? (
        <p className="rounded-lg border border-[#CFE8D8] bg-[#F0FDF4] px-3 py-2 text-sm font-medium text-[#166534]">
          {successMessage}
        </p>
      ) : null}

      <SecurityRow
        label="Email address"
        description="The email address associated with your account."
      >
        <span className="text-sm text-[#344256] font-medium">{email}</span>
      </SecurityRow>

      <Divider />

      <SecurityRow
        label="Password"
        description={
          setupNewPassword
            ? "Add a password so you can sign in without OAuth."
            : "Set a unique password to protect your account."
        }
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="rounded-lg border-[#D1D9E6] text-[#344256] font-medium text-sm h-9 px-4 hover:bg-[#F0F4FA]"
            >
              {setupNewPassword ? "Set Password" : "Change Password"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#EEF3FD] mx-auto mb-2">
                <Key className="size-5 text-[#2F6FE4]" />
              </div>
              <DialogTitle className="text-center text-[#1A2233]">
                {setupNewPassword ? "Set your password" : "Change your password"}
              </DialogTitle>
              <DialogDescription className="text-center text-[#6B7A99]">
                {setupNewPassword
                  ? "Choose and confirm a password for your account."
                  : "Enter your current password, then choose and confirm a new password."}
              </DialogDescription>
            </DialogHeader>

            <fetcher.Form
              method="post"
              className="space-y-4"
              onSubmit={(event) => {
                if (!validatePasswordForm()) {
                  event.preventDefault();
                  return;
                }

                setSubmittedPasswords({
                  oldPassword,
                  newPassword,
                  confirmPassword,
                });
              }}
            >
              <input type="hidden" name="intent" value="change-password" />
              {!setupNewPassword ? (
                <PasswordField
                  id="old-password"
                  name="oldPassword"
                  label="Current password"
                  autoComplete="current-password"
                  value={oldPassword}
                  onChange={(event) => {
                    setOldPassword(event.target.value);
                    setClientErrors((current) => ({
                      ...current,
                      oldPassword: undefined,
                    }));
                  }}
                  inputClassName="h-11 border-[#E5EAF2] bg-white pl-3 pr-10 text-sm"
                  labelClassName="text-sm font-medium text-[#1A2233]"
                  error={clientErrors.oldPassword ?? serverErrors?.oldPassword}
                />
              ) : null}

              <PasswordField
                id="new-password"
                name="newPassword"
                label="New password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setClientErrors((current) => ({
                    ...current,
                    newPassword: undefined,
                    confirmPassword: undefined,
                  }));
                }}
                inputClassName="h-11 border-[#E5EAF2] bg-white pl-3 pr-10 text-sm"
                labelClassName="text-sm font-medium text-[#1A2233]"
                error={clientErrors.newPassword ?? serverErrors?.newPassword}
              />

              <PasswordField
                id="confirm-password"
                name="confirmPassword"
                label="Confirm new password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setClientErrors((current) => ({
                    ...current,
                    confirmPassword: undefined,
                  }));
                }}
                inputClassName="h-11 border-[#E5EAF2] bg-white pl-3 pr-10 text-sm"
                labelClassName="text-sm font-medium text-[#1A2233]"
                error={
                  clientErrors.confirmPassword ??
                  liveConfirmPasswordError ??
                  serverErrors?.confirmPassword
                }
              />

              {serverErrors?.form || (setupNewPassword && serverErrors?.oldPassword) ? (
                <p className="text-sm font-medium text-red-600">
                  {serverErrors.form ?? serverErrors.oldPassword}
                </p>
              ) : null}

              <DialogFooter className="flex-col gap-2 rounded-b-2xl sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg border-[#D1D9E6] text-[#344256]"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-[#2F6FE4] text-white hover:bg-[#1F62DF]"
                >
                  {isSubmitting
                    ? setupNewPassword
                      ? "Setting..."
                      : "Changing..."
                    : setupNewPassword
                      ? "Set password"
                      : "Change password"}
                </Button>
              </DialogFooter>
            </fetcher.Form>
          </DialogContent>
        </Dialog>
      </SecurityRow>

      <Divider />

      <SecurityRow
        label="2-step verification"
        description="Make your account extra secure. Along with your password, you'll need to enter a code"
      >
        <TwoFactorToggle enabled={enabled} onEditSettings={onEdit2FA} />
      </SecurityRow>
    </div>
  );
}
