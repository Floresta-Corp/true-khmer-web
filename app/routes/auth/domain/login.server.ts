import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { LoginErrors } from "./auth.types";
import {
  AuthApiError,
  getAuthErrorCode,
  getAuthErrorMessage,
  getAuthFieldError,
  isTwoFactorRequiredResponse,
  loginUser,
  loginWithGoogle,
} from "~/services/auth/api.server";
import {
  createPendingTwoFactorLogin,
  createUserSession,
} from "~/lib/server/session.server";
import { redirectIfAuthenticated } from "~/lib/server/route-guards.server";
import { sanitizeRedirectPath } from "~/lib/redirects";
import { destinationAfterAuth } from "./auth-flow.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const authRedirect = await redirectIfAuthenticated(request);
  if (authRedirect) throw authRedirect;
  return {};
}

function isUnverifiedAccountError(error: AuthApiError) {
  return getAuthErrorCode(error.details) === "EMAIL_NOT_VERIFIED";
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const rememberMe = formData.get("rememberMe") === "true";
  const redirectTo = sanitizeRedirectPath(
    formData.get("redirectTo")?.toString(),
  );

  if (intent === "google") {
    const idToken = String(formData.get("idToken") || "").trim();
    if (!idToken) {
      return { errors: { form: "Google sign-in was not completed." } };
    }

    try {
      const auth = await loginWithGoogle(idToken, request);
      const destination = destinationAfterAuth(auth.authFlow, redirectTo);
      return createUserSession(request, auth, destination, { rememberMe });
    } catch (error) {
      if (error instanceof AuthApiError) {
        return { errors: { form: error.message } };
      }
      return {
        errors: {
          form:
            error instanceof Error
              ? `Google sign-in failed: ${error.message}`
              : "Google sign-in failed. Please try again.",
        },
      };
    }
  }

  const errors: LoginErrors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (Object.keys(errors).length > 0) return { errors };

  try {
    const auth = await loginUser(email, password, request);
    if (isTwoFactorRequiredResponse(auth)) {
      return createPendingTwoFactorLogin(
        request,
        {
          twoFactorToken: auth.twoFactorToken,
          methods: auth.twoFactorMethods,
          expiresAt: new Date(Date.now() + auth.expiresIn * 1000).toISOString(),
          rememberMe,
        },
        `/login/2fa?redirectTo=${encodeURIComponent(redirectTo)}`,
      );
    }

    const postLoginPath = destinationAfterAuth(auth.authFlow, redirectTo);
    return createUserSession(request, auth, postLoginPath, { rememberMe });
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (isUnverifiedAccountError(error)) {
        const message =
          getAuthErrorMessage(error.details) ||
          "Verification code sent. Please verify OTP.";
        const otpSent = error.details?.otpSent ? "1" : "0";

        return redirect(
          `/verify-otp?email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent(redirectTo)}&otpSent=${otpSent}&message=${encodeURIComponent(message)}&from=login`,
        );
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
      if (error.status === 401) {
        return { errors: { form: "Invalid email or password" } };
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
}

export function meta() {
  return [{ title: "Login | True Khmer" }];
}
