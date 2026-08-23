import type { OAuthAuthResult } from "../types";

export function postAuthResult(origin: string, result: OAuthAuthResult) {
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(
      {
        type: "AUTH_SUCCESS",
        payload: {
          token: result.accessToken,
          user: {
            userId: result.user.id,
            username: result.user.name,
            email: result.user.email,
          },
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
