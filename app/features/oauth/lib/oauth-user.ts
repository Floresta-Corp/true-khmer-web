import type { OAuthSessionUser } from "../types";

// Covers the /me profile user (displayName/firstName/lastName), the SSO user
// payload (username/...) and the login response user (name/...).
export type OAuthUserLike = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export function toOAuthSessionUser(user: OAuthUserLike): OAuthSessionUser {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return {
    id: user.id,
    name:
      user.displayName || user.username || user.name || fullName || user.email,
    email: user.email,
  };
}
