import { data, redirect } from "react-router";

type AuthCookie = {
  setCookie?: string | string[];
};

function appendSetCookie(headers: Headers, setCookie?: string | string[]) {
  if (!setCookie) return;

  for (const cookie of Array.isArray(setCookie) ? setCookie : [setCookie]) {
    headers.append("Set-Cookie", cookie);
  }
}

function withAuthHeaders(auth: AuthCookie, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  appendSetCookie(headers, auth.setCookie);
  return { ...init, headers };
}

export function withAuthData<T>(
  auth: AuthCookie,
  payload: T,
  init?: ResponseInit,
) {
  return data(payload, withAuthHeaders(auth, init));
}

export function withAuthJson<T>(
  auth: AuthCookie,
  payload: T,
  init?: ResponseInit,
) {
  return Response.json(payload, withAuthHeaders(auth, init));
}

/** For raw bodies (file downloads, streams) that still need refreshed cookies. */
export function withAuthResponse(
  auth: AuthCookie,
  body: BodyInit,
  init?: ResponseInit,
) {
  return new Response(body, withAuthHeaders(auth, init));
}

export function withAuthRedirect(
  auth: AuthCookie,
  url: string,
  init?: ResponseInit,
) {
  return redirect(url, withAuthHeaders(auth, init));
}
