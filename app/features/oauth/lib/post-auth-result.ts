import type { OAuthHandoffResult } from "../types";

type OAuthReturnTarget = {
  origin: string;
  platform: "web" | "native";
  redirectUri: string | null;
  state: string | null;
};

function redirectToNative(redirectUri: string, params: Record<string, string>) {
  const redirect = new URL(redirectUri);
  for (const [name, value] of Object.entries(params)) {
    redirect.searchParams.set(name, value);
  }
  window.location.replace(redirect.toString());
}

export function postAuthResult(
  target: OAuthReturnTarget,
  result: OAuthHandoffResult,
) {
  if (target.platform === "native" && target.redirectUri && target.state) {
    redirectToNative(target.redirectUri, {
      handoffToken: result.handoffToken,
      expiresIn: String(result.expiresIn),
      expiresAt: result.expiresAt,
      state: target.state,
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
  if (target.platform === "native" && target.redirectUri && target.state) {
    redirectToNative(target.redirectUri, {
      error: "access_denied",
      state: target.state,
    });
    return;
  }

  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: "AUTH_CLOSE" }, target.origin);
  }
  window.close();
}
