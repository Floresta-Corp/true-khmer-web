export type OAuthLoginFieldErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export type OAuthSessionUser = {
  id: string;
  name: string;
  email: string;
};

export type OAuthAuthResult = {
  accessToken: string;
  user: OAuthSessionUser;
};

export type OAuthLoginActionData = {
  errors?: OAuthLoginFieldErrors;
  success?: OAuthAuthResult;
};

export type OAuthHandoffResult = {
  ok: boolean;
  handoffToken: string;
  expiresIn: number;
  expiresAt: string;
  origin?: string;
};
