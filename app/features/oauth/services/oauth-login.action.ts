import type { Route } from "project-types/oauth/route/+types/oauth-login";
import {
  AuthApiError,
  getAuthFieldError,
  isTwoFactorRequiredResponse,
  loginUser,
} from "~/services/auth/api.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import {
  commitAuthToSession,
  createPendingTwoFactorLogin,
  destroySession,
  getSession,
} from "~/lib/server/session.server";
import { isOAuthResumeRedirect, sanitizeRedirectPath } from "~/lib/redirects";
import { toOAuthSessionUser } from "../lib/oauth-user";
import { oauthLoginSchema } from "../lib/oauth-login-schema";
import {
  OAUTH_LOGOUT_INTENT,
  OAUTH_RETURN_TO_FIELD,
  type OAuthLoginActionData,
  type OAuthLoginFieldErrors,
} from "../types";

export type { OAuthLoginActionData, OAuthLoginFieldErrors } from "../types";

function OauthLoginError(error: unknown): OAuthLoginActionData {
  if (error instanceof AuthApiError) {
    if (error.status === 401) {
      return { errors: { form: "Invalid email or password" } };
    }
    if (error.status === 400) {
      return {
        errors: {
          email: getAuthFieldError(error.details, "email"),
          password: getAuthFieldError(error.details, "password"),
          form: error.message,
        },
      };
    }
    return { errors: { form: error.message } };
  }

  return {
    errors: {
      form:
        error instanceof Error
          ? `Login failed: ${error.message}`
          : "Login failed. Please try again.",
    },
  };
}

// Switching accounts is a real sign-out: the consent card offers whatever
// `__session` holds, so leaving that session in place would just hand the same
// account straight back. This destroys it here rather than posting to /logout
// because that route redirects to /login, which would take the popup off the
// OAuth request it was opened with and lose the clientId and origin.
async function oauthLogout(request: Request) {
  const session = await getSession(request);

  return withAuthData({ setCookie: await destroySession(session) }, {
    loggedOut: true,
  } satisfies OAuthLoginActionData);
}

// The popup has no "remember me" checkbox — it is a one-shot window the user
// closes as soon as consent is given, so asking there would be noise. Signing
// in through it is treated as a deliberate sign-in and persists like a checked
// box would, rather than dying with the popup and leaving the user signed out
// of the site they just authorized.
const OAUTH_REMEMBER_ME = true;

// The authorization URL to come back to once a detour finishes. Only a path
// back into this same OAuth request carrying the resume flag is accepted, so a
// tampered field cannot turn the two-factor page into an open redirect.
function readOAuthReturnTo(formData: FormData) {
  const returnTo = sanitizeRedirectPath(
    formData.get(OAUTH_RETURN_TO_FIELD)?.toString(),
  );

  return isOAuthResumeRedirect(returnTo) ? returnTo : null;
}

export async function OauthLoginAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  if (formData.get("intent") === OAUTH_LOGOUT_INTENT) {
    return oauthLogout(request);
  }

  const parseResult = oauthLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parseResult.success) {
    const fieldErrors = parseResult.error.flatten().fieldErrors;
    return {
      errors: {
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      } as OAuthLoginFieldErrors,
    } satisfies OAuthLoginActionData;
  }

  const { email, password } = parseResult.data;

  try {
    const auth = await loginUser(email, password, request);

    // No tokens yet — the account wants a second factor. Park the challenge in
    // its own short-lived cookie and send this window to `/oauth/2fa`, which
    // runs the main login's two-factor step inside the popup card. Verifying
    // there writes `__session` and redirects back to this exact OAuth request,
    // where the loader picks the session up and the consent card takes over.
    if (isTwoFactorRequiredResponse(auth)) {
      const returnTo = readOAuthReturnTo(formData);

      if (!returnTo) {
        return {
          errors: {
            form: "This account has two-factor authentication enabled. Please sign in from the main login page first, then reopen this window.",
          },
        } satisfies OAuthLoginActionData;
      }

      return createPendingTwoFactorLogin(
        request,
        {
          twoFactorToken: auth.twoFactorToken,
          methods: auth.twoFactorMethods,
          expiresAt: new Date(Date.now() + auth.expiresIn * 1000).toISOString(),
          rememberMe: OAUTH_REMEMBER_ME,
        },
        `/oauth/2fa?redirectTo=${encodeURIComponent(returnTo)}`,
      );
    }

    const success = {
      success: {
        accessToken: auth.accessToken,
        // The refresh token rides along so a consent step that sits open past
        // the access token's lifetime can still be completed.
        refreshToken: auth.refreshToken ?? null,
        user: toOAuthSessionUser(auth.user),
      },
    } satisfies OAuthLoginActionData;

    // Save the login into the normal site session, same as any other login —
    // the popup just renders the result inline instead of redirecting.
    const sessionHeaders = await commitAuthToSession(request, auth, {
      rememberMe: OAUTH_REMEMBER_ME,
    });
    const setCookie = sessionHeaders.get("Set-Cookie") ?? undefined;

    return withAuthData({ setCookie }, success);
  } catch (error) {
    return OauthLoginError(error);
  }
}
