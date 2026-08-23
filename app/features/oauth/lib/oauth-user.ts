import type { OAuthSessionUser } from "../types";

// Covers both the SSO user payload (username/firstName/lastName) and the login
// response user (name/firstName/lastName).
export type OAuthUserLike = {
  id: string;
  email: string;
  name?: string | null;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

export function toOAuthSessionUser(user: OAuthUserLike): OAuthSessionUser {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return {
    id: user.id,
    name: user.username || user.name || fullName || user.email,
    email: user.email,
  };
}
