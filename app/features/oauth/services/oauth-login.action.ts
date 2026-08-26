import type { Route } from "project-types/oauth/route/+types/oauth-login";
import {
  AuthApiError,
  getAuthFieldError,
  isTwoFactorRequiredResponse,
  loginUser,
} from "~/services/auth/api.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { commitAuthToSession } from "~/lib/server/session.server";
import { toOAuthSessionUser } from "../lib/oauth-user";
import { oauthLoginSchema } from "../lib/oauth-login-schema";
import type { OAuthLoginActionData, OAuthLoginFieldErrors } from "../types";

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

export async function OauthLoginAction({ request }: Route.ActionArgs) {
  const formData = await request.formData();
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
