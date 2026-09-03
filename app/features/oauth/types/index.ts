// The OAuth login route's action serves two different submissions: the
// credentials POST from the login form, and the sign-out the consent card
// sends when the user chooses a different account. This tells them apart.
// It lives here rather than in the action so a component can import it without
// dragging server-only modules into the browser bundle.
export const OAUTH_LOGOUT_INTENT = "logout";

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
  // Kept beside the access token so an expired access token can be traded in
  // without sending the user back through the login form. `null` only for a
  // session that predates this, or one the API issued without a refresh token.
  refreshToken: string | null;
  user: OAuthSessionUser;
};

export type OAuthLoginActionData = {
  errors?: OAuthLoginFieldErrors;
  success?: OAuthAuthResult;
  // The sign-out went through and `__session` has been destroyed.
  loggedOut?: boolean;
};

export type OAuthHandoffResult = {
  ok: boolean;
  handoffToken: string;
  expiresIn: number;
  expiresAt: string;
  origin?: string;
  // Set when the handoff found both tokens expired and cleared the session:
  // the card drops its own copy and reloads into the login form.
  sessionExpired?: boolean;
};
