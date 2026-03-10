import { useState } from "react";
import { Form, Link, redirect, useActionData, useSearchParams } from "react-router";
import { Lock, Mail } from "lucide-react";
import type { Route } from "./+types/login";
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
import { FormDivider } from "~/components/auth/form-divider";
import { FormError } from "~/components/auth/form-error";
import { GoogleButton } from "~/components/auth/google-button";
import { InputField } from "~/components/auth/input-field";
import { AuthPageShell } from "~/components/auth/page-shell";
import { PasswordField } from "~/components/auth/password-field";
import { PrimaryButton } from "~/components/auth/primary-button";
import { sanitizeRedirectPath } from "~/lib/redirects";

export async function loader({ request }: Route.LoaderArgs) {
  const authRedirect = await redirectIfAuthenticated(request);
  if (authRedirect) throw authRedirect;
  return {};
}

function isUnverifiedAccountError(error: AuthApiError) {
  const details = error.details as Record<string, unknown> | undefined;
  const code = typeof details?.code === "string" ? details.code : "";
  return code === "EMAIL_NOT_VERIFIED";
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const redirectTo = sanitizeRedirectPath(
    formData.get("redirectTo")?.toString(),
  );

  const errors: { email?: string; password?: string; form?: string } = {};
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
          `/verify-otp?email=${encodeURIComponent(email)}&redirectTo=${encodeURIComponent(redirectTo)}&otpSent=${otpSent}&message=${encodeURIComponent(message)}`,
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

export default function LoginPage() {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();
  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isSignInEnabled = email.trim() !== "" && password.trim() !== "";

  return (
    <AuthPageShell>
      <div className="mt-6 space-y-5 lg:mt-8 lg:space-y-6 xl:mt-18 xl:space-y-8">
        <img
          src="/logofullcolor.svg"
          alt="True Khmer"
          className="mx-auto h-9 w-auto object-contain sm:h-10"
        />

        <h1 className="text-center text-3xl font-semibold leading-8 text-[#030213]">
          Welcome Back
        </h1>

        <GoogleButton />

        <FormDivider />

        <FormError message={actionData?.errors?.form} />

        <Form method="post" className="space-y-6">
          <input type="hidden" name="redirectTo" value={redirectTo} />

          <InputField
            id="email"
            name="email"
            type="email"
            label="Email address"
            icon={Mail}
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            error={actionData?.errors?.email}
          />

          <div className="space-y-2">
            <PasswordField
              id="password"
              name="password"
              label="Password"
              icon={Lock}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              error={actionData?.errors?.password}
            />

            <div className="flex justify-end">
              <button
                type="button"
                className="text-[13px] font-semibold leading-4 text-[#2F6FE4]"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <PrimaryButton type="submit" disabled={!isSignInEnabled}>
            Sign in
          </PrimaryButton>
        </Form>

        <p className="text-center text-sm font-medium leading-5 text-[#6A7282]">
          New to True Khmer?{" "}
          <Link to="/register" className="font-semibold text-[#2F6FE4]">
            Create account
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
