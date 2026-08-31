const MAX_REDIRECT_URI_LENGTH = 1024;
const BLOCKED_SCHEMES = new Set([
  "about",
  "blob",
  "data",
  "file",
  "http",
  "https",
  "javascript",
]);
const EXPO_GO_SCHEMES = new Set(["exp", "exps"]);

/** Accept only a plain app deep link that can safely receive OAuth results. */
export function readNativeRedirectUri(
  value: string | null,
  allowExpoGo = false,
): string | null {
  const redirectUri = value?.trim();
  if (!redirectUri || redirectUri.length > MAX_REDIRECT_URI_LENGTH) return null;

  let redirect: URL;
  try {
    redirect = new URL(redirectUri);
  } catch {
    return null;
  }

  const scheme = redirect.protocol.slice(0, -1).toLowerCase();
  const isExpoGo = EXPO_GO_SCHEMES.has(scheme);
  if (
    BLOCKED_SCHEMES.has(scheme) ||
    (isExpoGo && !allowExpoGo) ||
    !redirect.hostname ||
    !redirect.pathname ||
    redirect.pathname === "/" ||
    redirect.username ||
    redirect.password ||
    redirect.search ||
    redirect.hash ||
    (redirect.port && !isExpoGo)
  ) {
    return null;
  }

  return `${scheme}://${redirect.host.toLowerCase()}${redirect.pathname}`;
}
