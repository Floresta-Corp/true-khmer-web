export function sanitizeRedirectPath(
  value: string | null | undefined,
  fallback = "/home",
) {
  if (!value) return fallback;

  const redirectTo = value.trim();
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return fallback;
  }

  return redirectTo;
}
