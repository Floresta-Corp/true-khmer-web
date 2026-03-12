import {
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "react-router";
import type { LoginActionData, LoginErrors } from "./auth.types";
import {
  AuthApiError,
  getAuthFieldError,
  loginUser,
} from "~/services/auth.server";
import { createUserSession } from "~/lib/server/session.server";
import {
  destinationFromOnboardingState,
  getOnboardingStateWithToken,
} from "~/services/onboarding.server";
import { redirectIfAuthenticated } from "~/lib/server/route-guards.server";
import { sanitizeRedirectPath } from "~/lib/redirects";

export async function loader({ request }: LoaderFunctionArgs) {
  const authRedirect = await redirectIfAuthenticated(request);
  if (authRedirect) throw authRedirect;
  return {};
}

function isUnverifiedAccountError(error: AuthApiError) {
  const details = error.details as Record<string, unknown> | undefined;
  const code = typeof details?.code === "string" ? details.code : "";
  return code === "EMAIL_NOT_VERIFIED";
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const redirectTo = sanitizeRedirectPath(
    formData.get("redirectTo")?.toString(),
  );

  const errors: LoginErrors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  if (Object.keys(errors).length > 0) return { errors };

  try {
    const auth = await loginUser(email, password, request);
    const onboardingState = await getOnboardingStateWithToken(
      request,
      auth.accessToken,
    );
    const postLoginPath = onboardingState.completed
      ? redirectTo
      : destinationFromOnboardingState(onboardingState);
    return createUserSession(auth, postLoginPath);
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (isUnverifiedAccountError(error)) {
        const details = error.details as Record<string, unknown> | undefined;
        const message =
          (typeof details?.message === "string" && details.message) ||
          "Verification code sent. Please verify OTP.";
        const otpSent = details?.otpSent === true ? "1" : "0";

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
