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
import { AuthPageShell } from "~/components/auth/page-shell";
import { PasswordField } from "~/components/auth/password-field";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="block text-[13px] font-semibold leading-[19.5px] text-[#364153]"
            >
              Email address
            </Label>
            <div className="relative">
              <Mail
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#D1D5DC]"
              />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                className="h-11 rounded-lg border-transparent bg-[#F8FAFC] py-2 pl-9 pr-3 text-[12.25px] font-medium text-[#1E293B] placeholder:text-[#C8D6E5] focus-visible:ring-[#2F6FE4]/30"
              />
            </div>
            {actionData?.errors?.email ? (
              <p className="text-xs text-red-500">{actionData.errors.email}</p>
            ) : null}
          </div>

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
              <Button
                type="button"
                variant="link"
                className="h-auto px-0 text-[13px] font-semibold leading-4 text-[#2F6FE4] hover:text-[#1F62DF]"
              >
                Forgot password?
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isSignInEnabled}
            className={`h-10 w-full rounded-lg text-sm font-medium transition-colors ${
              isSignInEnabled
                ? "bg-[#2F6FE4] text-white hover:bg-[#1F62DF]"
                : "cursor-not-allowed bg-[#F1F5F9] text-[#0F172B] opacity-50"
            }`}
          >
            Sign in
          </Button>
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
