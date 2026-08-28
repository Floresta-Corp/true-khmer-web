const MAX_CALLBACK_URI_LENGTH = 1024;
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

/**
 * Accept only a plain app deep link. Query and fragment values are reserved
 * for the OAuth result, and browser-capable schemes are deliberately rejected.
 */
export function readNativeCallbackUri(
  value: string | null,
  allowExpoGo = false,
): string | null {
  const callbackUri = value?.trim();
  if (!callbackUri || callbackUri.length > MAX_CALLBACK_URI_LENGTH) return null;

  let callback: URL;
  try {
    callback = new URL(callbackUri);
  } catch {
    return null;
  }

  const scheme = callback.protocol.slice(0, -1).toLowerCase();
  const isExpoGo = EXPO_GO_SCHEMES.has(scheme);
  if (
    BLOCKED_SCHEMES.has(scheme) ||
    (isExpoGo && !allowExpoGo) ||
    !callback.hostname ||
    !callback.pathname ||
    callback.pathname === "/" ||
    callback.username ||
    callback.password ||
    callback.search ||
    callback.hash ||
    (callback.port && !isExpoGo)
  ) {
    return null;
  }

  return `${scheme}://${callback.host.toLowerCase()}${callback.pathname}`;
}
