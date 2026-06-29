import type {
  AdminLoginRequest,
  AdminLoginOtpChallengeResponse,
  AdminVerifyLoginOtpRequest,
} from "~/types/api-client";

export type AdminLoginFieldErrors = Partial<
  Record<keyof AdminLoginRequest | "form", string>
>;

export type AdminLoginActionData = {
  errors?: AdminLoginFieldErrors;
  retryAfterSeconds?: number;
};

export type AdminOtpFieldErrors = Partial<
  Record<keyof Pick<AdminVerifyLoginOtpRequest, "otp"> | "form", string>
>;

export type AdminOtpActionData = {
  errors?: AdminOtpFieldErrors;
  challengeExhausted?: boolean;
  retryAfterSeconds?: number;
};

export type AdminOtpLoaderData = Pick<
  AdminLoginOtpChallengeResponse,
  "challengeId" | "expiresAt"
> & {
  rememberMe: boolean;
  redirectTo: string;
};
