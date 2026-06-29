import type { AuthTwoFactorTotpSetupResponse } from "~/types/api-client";

export type SettingsActionData = {
  ok?: boolean;
  intent?: string;
  message?: string;
  setup?: AuthTwoFactorTotpSetupResponse;
  errors?: {
    oldPassword?: string;
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
    code?: string;
    form?: string;
  };
};
