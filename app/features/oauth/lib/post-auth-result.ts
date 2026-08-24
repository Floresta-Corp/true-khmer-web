import type { OAuthHandoffResult, OAuthSessionUser } from "../types";

export function postAuthResult(origin: string, result: OAuthHandoffResult) {
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
      origin,
    );
  }
  window.close();
}

export function postAuthClose(origin: string) {
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ type: "AUTH_CLOSE" }, origin);
  }
  window.close();
}
