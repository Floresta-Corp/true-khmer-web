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
  destroySession,
  getSession,
} from "~/lib/server/session.server";
import { toOAuthSessionUser } from "../lib/oauth-user";
import { oauthLoginSchema } from "../lib/oauth-login-schema";
import {
  OAUTH_LOGOUT_INTENT,
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

    if (isTwoFactorRequiredResponse(auth)) {
      return {
        errors: {
          form: "This account has two-factor authentication enabled. Please sign in from the main login page first, then reopen this window.",
        },
      } satisfies OAuthLoginActionData;
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
    const sessionHeaders = await commitAuthToSession(request, auth);
    const setCookie = sessionHeaders.get("Set-Cookie") ?? undefined;

    return withAuthData({ setCookie }, success);
  } catch (error) {
    return OauthLoginError(error);
  }
}
