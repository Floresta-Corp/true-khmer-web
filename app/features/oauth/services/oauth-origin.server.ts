import { getServerEnv } from "~/lib/server/env";

export function getAllowedOauthOrigin() {
  return getServerEnv("OAUTH_ALLOWED_ORIGIN");
}

export function isAllowedOauthOrigin(origin: string | null): origin is string {
  const allowed = getAllowedOauthOrigin();

  return Boolean(origin && allowed && origin === allowed);
}
