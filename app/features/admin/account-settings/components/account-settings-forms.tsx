import { type ChangeEvent, type RefObject, useEffect, useState } from "react";
import { Form } from "react-router";
import { Lock, Mail, User as UserIcon } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { AdminUser } from "~/types/api-client";
import {
  FormField,
  SaveBar,
  SettingsCard,
  inputClass,
  labelClass,
  useFieldErrors,
} from "./account-settings-ui";
import {
  type FieldErrors,
  hasErrors,
  validatePasswordChange,
  validateProfile,
} from "./account-settings.validation";

type Props = {
  admin: AdminUser;
  isSubmitting: boolean;
  submitIntent: FormDataEntryValue | null | undefined;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hasAvatarChange: boolean;
  passwordResetSignal: number;
  profileFieldErrors?: FieldErrors;
  passwordFieldErrors?: FieldErrors;
};

export function AccountSettingsForms({
  admin,
  isSubmitting,
  submitIntent,
  fileInputRef,
  onFileChange,
  hasAvatarChange,
  passwordResetSignal,
  profileFieldErrors,
  passwordFieldErrors,
}: Props) {
  return (
    <div className="space-y-5">
      <ProfileForm
        admin={admin}
        isPending={isSubmitting && submitIntent === "update-profile"}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
        hasAvatarChange={hasAvatarChange}
        serverErrors={profileFieldErrors}
      />

      <SettingsCard icon={Mail} accent="blue" title="Email Address">
        <div>
          <Label className={labelClass}>Email Address</Label>
          <Input
            type="email"
            value={admin.email}
            readOnly
            className={cn(inputClass, "opacity-80 cursor-not-allowed")}
          />
        </div>
      </SettingsCard>

      <PasswordForm
        isPending={isSubmitting && submitIntent === "change-password"}
        resetSignal={passwordResetSignal}
        serverErrors={passwordFieldErrors}
      />
    </div>
  );
}

function ProfileForm({
  admin,
  isPending,
  fileInputRef,
  onFileChange,
  hasAvatarChange,
  serverErrors,
}: {
  admin: AdminUser;
  isPending: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hasAvatarChange: boolean;
  serverErrors?: FieldErrors;
}) {
  const [firstName, setFirstName] = useState(admin.firstName ?? "");
  const [lastName, setLastName] = useState(admin.lastName ?? "");
  const { errors, setErrors, clearError } = useFieldErrors(serverErrors);

  const isChanged =
    hasAvatarChange ||
    firstName !== (admin.firstName ?? "") ||
    lastName !== (admin.lastName ?? "");

  const validate = () => {
    const next = validateProfile({ firstName, lastName });
    setErrors(next);
    return !hasErrors(next);
  };

  return (
    <Form
      method="post"
      encType="multipart/form-data"
      onSubmit={(e) => {
        if (!validate()) e.preventDefault();
      }}
    >
      <input type="hidden" name="intent" value="update-profile" />
      <input
        ref={fileInputRef}
        id="avatarFileInput"
        type="file"
        name="avatarFile"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      <SettingsCard icon={UserIcon} accent="blue" title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="firstName"
            placeholder="John"
            value={firstName}
            error={errors.firstName}
            onValueChange={(value) => {
              setFirstName(value);
              clearError("firstName");
            }}
          />
          <FormField
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={lastName}
            error={errors.lastName}
            onValueChange={(value) => {
              setLastName(value);
              clearError("lastName");
            }}
          />
        </div>

        <SaveBar
          show={isChanged}
          isPending={isPending}
          label="Save Changes"
          pendingLabel="Saving…"
        />
      </SettingsCard>
    </Form>
  );
}

function PasswordForm({
  isPending,
  resetSignal,
  serverErrors,
}: {
  isPending: boolean;
  resetSignal: number;
  serverErrors?: FieldErrors;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { errors, setErrors, clearError } = useFieldErrors(serverErrors);

  // Clear the fields after a successful change (signal bumps on success).
  useEffect(() => {
    if (resetSignal === 0) return;
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }, [resetSignal]);

  const isChanged =
    currentPassword !== "" || newPassword !== "" || confirmPassword !== "";

  const validate = () => {
    const next = validatePasswordChange({
      currentPassword,
      newPassword,
      confirmPassword,
    });
    setErrors(next);
    return !hasErrors(next);
  };

  return (
    <Form
      method="post"
      onSubmit={(e) => {
        if (!validate()) e.preventDefault();
      }}
    >
      <input type="hidden" name="intent" value="change-password" />

      <SettingsCard icon={Lock} accent="green" title="Security">
        <div className="space-y-4">
          <FormField
            label="Current Password"
            type="password"
            name="currentPassword"
            placeholder="Enter your current password"
            autoComplete="current-password"
            value={currentPassword}
            error={errors.currentPassword}
            onValueChange={(value) => {
              setCurrentPassword(value);
              clearError("currentPassword");
            }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="New Password"
              type="password"
              name="newPassword"
              placeholder="Min. 8 characters, no spaces"
              autoComplete="new-password"
              value={newPassword}
              error={errors.newPassword}
              onValueChange={(value) => {
                setNewPassword(value);
                clearError("newPassword");
              }}
            />
            <FormField
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your new password"
              autoComplete="new-password"
              value={confirmPassword}
              error={errors.confirmPassword}
              onValueChange={(value) => {
                setConfirmPassword(value);
                clearError("confirmPassword");
              }}
            />
          </div>
        </div>

        <SaveBar
          show={isChanged}
          isPending={isPending}
          label="Update Password"
          pendingLabel="Updating…"
        />
      </SettingsCard>
    </Form>
  );
}
