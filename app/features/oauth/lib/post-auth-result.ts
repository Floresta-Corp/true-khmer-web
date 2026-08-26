import type { OAuthHandoffResult } from "../types";

type OAuthReturnTarget = {
  origin: string;
  platform: "web" | "native";
  /** Supplied by the native app and checked for URL safety by the loader. */
  redirectUri: string | null;
};

function redirectToNative(redirectUri: string, params: Record<string, string>) {
  const callback = new URL(redirectUri);
  for (const [name, value] of Object.entries(params)) {
    callback.searchParams.set(name, value);
  }
  window.location.replace(callback.toString());
}

export function postAuthResult(
  target: OAuthReturnTarget,
  result: OAuthHandoffResult,
) {
  if (target.platform === "native" && target.redirectUri) {
    redirectToNative(target.redirectUri, {
      handoffToken: result.handoffToken,
      expiresIn: String(result.expiresIn),
      expiresAt: result.expiresAt,
    });
    return;
  }

  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(
      {
        type: "AUTH_SUCCESS",
        payload: {
          ok: result.ok,
          handoffToken: result.handoffToken,
          expiresIn: result.expiresIn,
          expiresAt: result.expiresAt,
        },
      },
      target.origin,
    );
  }
  window.close();
}

export function postAuthClose(target: OAuthReturnTarget) {
  if (target.platform === "native" && target.redirectUri) {
    redirectToNative(target.redirectUri, { error: "access_denied" });
    return;
  }

  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: "AUTH_CLOSE" }, target.origin);
  }
  window.close();
}
