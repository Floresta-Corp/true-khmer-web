import type {
  AuthTwoFactorSettingsResponse,
  AuthTwoFactorTotpSetupResponse,
} from "~/types/api-client";

export type SettingsOutletContext = {
  email: string;
  setupNewPassword: boolean;
  twoFactor: AuthTwoFactorSettingsResponse;
};

export type SettingsActionData = {
  ok?: boolean;
  intent?: string;
  message?: string;
  setup?: AuthTwoFactorTotpSetupResponse;
  // Time left on the emailed 2FA code. Sent as a duration, not a timestamp,
  // so a wrong clock on the user's device can't stretch the countdown.
  expiresInMs?: number;
  // The API rejected the code as expired or over its attempt limit.
  codeExpired?: boolean;
  errors?: {
    oldPassword?: string;
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
    code?: string;
    form?: string;
  };
};
