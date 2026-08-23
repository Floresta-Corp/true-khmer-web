import { z } from "zod";
import type { Route } from "project-types/oauth/route/+types/oauth-login";
import {
  AuthApiError,
  getAuthFieldError,
  isTwoFactorRequiredResponse,
  loginUser,
} from "~/services/auth/api.server";
import { withAuthData } from "~/lib/server/auth-response.server";
import { toOAuthSessionUser } from "../lib/oauth-user";
import type { OAuthLoginActionData, OAuthLoginFieldErrors } from "../types";
import { isAllowedOauthOrigin } from "./oauth-origin.server";
import { commitOAuthSession } from "./oauth-session.server";

export type { OAuthLoginActionData, OAuthLoginFieldErrors } from "../types";

const oauthLoginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .min(1, "Email is required"),
  password: z.string().trim().min(1, "Password is required"),
});

function oauthLoginError(error: unknown): OAuthLoginActionData {
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

export async function oauthLoginAction({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const clientId = url.searchParams.get("client_id");
  if (!isAllowedOauthOrigin(url.searchParams.get("origin"))) {
    return {
      errors: {
        form: "This sign-in window was not opened from a trusted application.",
      },
    } satisfies OAuthLoginActionData;
  }

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
    // This popup only ever hands the token back to the opener via
    // postMessage — it never establishes a site session, so we call the
    // login API directly instead of createUserSession/commitAuthToSession.
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

    // Keep the issued token in the popup's own cookie so reopening the window
    // skips the login form. It is deliberately separate from the normal user
    // and admin sessions.
    const setCookie = clientId
      ? await commitOAuthSession(request, {
          accessToken: auth.accessToken,
          userId: auth.user.id,
          clientId,
        })
      : undefined;

    return withAuthData({ setCookie }, success);
  } catch (error) {
    return oauthLoginError(error);
  }
}
