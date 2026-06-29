export function sanitizeRedirectPath(
  value: string | null | undefined,
  fallback = "/",
) {
  if (!value) return fallback;

  const redirectTo = value.trim();
  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return fallback;
  }

  return redirectTo;
}
