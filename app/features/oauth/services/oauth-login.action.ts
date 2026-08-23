import { z } from "zod";
import type { Route } from "project-types/oauth/route/+types/oauth-login";
import {
  AuthApiError,
  getAuthFieldError,
  isTwoFactorRequiredResponse,
  loginUser,
} from "~/services/auth/api.server";
import type { OAuthLoginActionData, OAuthLoginFieldErrors } from "../types";
import { isAllowedOauthOrigin } from "./oauth-origin.server";

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

    const displayName =
      auth.user.name ||
      [auth.user.firstName, auth.user.lastName].filter(Boolean).join(" ") ||
      auth.user.email;

    return {
      success: {
        accessToken: auth.accessToken,
        user: { id: auth.user.id, name: displayName, email: auth.user.email },
      },
    } satisfies OAuthLoginActionData;
  } catch (error) {
    return oauthLoginError(error);
  }
}
