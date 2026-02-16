import { createCookieSessionStorage, redirect } from "react-router";

// In production, use a real secret from environment variables
const SESSION_SECRET =
  process.env.SESSION_SECRET || "super-secret-key-change-me";

// Create a cookie-based session storage
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

// Get the session from the request
export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

// Commit the session (returns Set-Cookie header value)
export async function commitSession(
  session: Awaited<ReturnType<typeof getSession>>,
) {
  return sessionStorage.commitSession(session);
}

// Destroy the session (for logout)
export async function destroySession(
  session: Awaited<ReturnType<typeof getSession>>,
) {
  return sessionStorage.destroySession(session);
}

// Get the logged-in user from the session, or null
export async function getUser(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  const email = session.get("email");

  if (!userId) return null;

  return { id: userId, email };
}

// Require user to be logged in — redirect to /login if not
export async function requireUser(request: Request) {
  const user = await getUser(request);
  if (!user) {
    throw redirect("/login");
  }
  return user;
}

// Create user session and redirect
export async function createUserSession(
  userId: string,
  email: string,
  redirectTo: string,
) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  session.set("email", email);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
