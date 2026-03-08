import { useEffect, useState } from "react";
import {
  Form,
  Link,
  redirect,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { ArrowLeft, Mail } from "lucide-react";
import {
  AuthApiError,
  getAuthFieldError,
  resendRegisterOtp,
  verifyRegisterOtp,
} from "~/services/auth.server";
import { createUserSession } from "~/lib/server/session.server";
import {
  destinationFromOnboardingState,
  getOnboardingStateWithToken,
} from "~/services/onboarding.server";
import { redirectIfAuthenticated } from "~/lib/server/route-guards.server";
import { InlineMessage } from "~/components/auth/inline-message";
import { OtpCodeInput } from "~/components/auth/otp-code-input";
import { PrimaryButton } from "~/components/auth/primary-button";

export async function loader({ request }: { request: Request }) {
  const authRedirect = await redirectIfAuthenticated(request);
  if (authRedirect) throw authRedirect;
  return {};
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "verify");
  const email = String(formData.get("email") || "");
  const otp = String(formData.get("otp") || "");
  const redirectTo = String(formData.get("redirectTo") || "/dashboard");

  if (intent === "resend") {
    const errors: { email?: string; otp?: string; form?: string } = {};
    if (!email) errors.email = "Email is required";
    if (Object.keys(errors).length > 0) return { errors };

    try {
      await resendRegisterOtp(email, request);
      return {
        resend: {
          success: true,
          message: "A new verification code has been sent to your email.",
        },
      };
    } catch (error) {
      if (error instanceof AuthApiError) {
        if (error.status === 400) {
          return {
            errors: {
              email: getAuthFieldError(error.details, "email"),
              form: error.message,
            },
          };
        }
        if (error.status === 404) {
          throw redirect("/register");
        }
        if (error.status === 409) {
          throw redirect("/login");
        }
        return { errors: { form: error.message } };
      }
      return {
        errors: {
          form:
            error instanceof Error
              ? `Could not resend OTP: ${error.message}`
              : "Could not resend OTP. Please try again.",
        },
      };
    }
  }

  const errors: { email?: string; otp?: string; form?: string } = {};
  if (!email) errors.email = "Email is required";
  if (!otp) errors.otp = "OTP is required";
  else if (!/^\d{6}$/.test(otp)) errors.otp = "OTP must be 6 digits";
  if (Object.keys(errors).length > 0) return { errors };

  try {
    const auth = await verifyRegisterOtp(email, otp, request);
    const onboardingState = await getOnboardingStateWithToken(
      request,
      auth.accessToken,
    );
    const destination = onboardingState.completed
      ? redirectTo
      : destinationFromOnboardingState(onboardingState);
    return createUserSession(auth, destination);
  } catch (error) {
    if (error instanceof AuthApiError) {
      if (error.status === 400) {
        const otpFieldError = getAuthFieldError(error.details, "otp");
        const emailFieldError = getAuthFieldError(error.details, "email");
        const normalizedMessage =
          error.message === "Authentication request failed." ||
          error.message === "Validation failed."
            ? "Incorrect OTP."
            : error.message;
        return {
          errors: {
            email: emailFieldError,
            otp: otpFieldError,
            form: otpFieldError ? normalizedMessage : "Incorrect OTP.",
          },
        };
      }
      if (error.status === 401) {
        return { errors: { form: "Incorrect OTP." } };
      }
      return { errors: { form: error.message } };
    }
    return {
      errors: {
        form:
          error instanceof Error
            ? `OTP verification failed: ${error.message}`
            : "OTP verification failed. Please try again.",
      },
    };
  }
}

export function meta() {
  return [{ title: "Verify OTP | True Khmer" }];
}

const OTP_EXPIRY_SECONDS = 5 * 60;
const RESEND_COOLDOWN_SECONDS = 30;

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function VerifyOtpPage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const infoMessage = searchParams.get("message") || "";
  const hasInitialOtp = searchParams.get("otpSent") !== "0";
  const [otp, setOtp] = useState("");
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(
    hasInitialOtp ? OTP_EXPIRY_SECONDS : 0,
  );
  const [resendCooldownSeconds, setResendCooldownSeconds] = useState(0);

  const submittingIntent = navigation.formData?.get("intent");
  const isResending =
    navigation.state === "submitting" && submittingIntent === "resend";
  const isVerifying =
    navigation.state === "submitting" &&
    (submittingIntent === "verify" || submittingIntent == null);

  useEffect(() => {
    const timer = setInterval(() => {
      setOtpRemainingSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
      setResendCooldownSeconds((seconds) => (seconds > 0 ? seconds - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (actionData?.resend?.success) {
      setOtp("");
      setOtpRemainingSeconds(OTP_EXPIRY_SECONDS);
      setResendCooldownSeconds(RESEND_COOLDOWN_SECONDS);
    }
  }, [actionData]);

  const canVerify = otp.length === 6 && !isVerifying;

  return (
    <div className="min-h-screen bg-[#f5f7fb] px-4 py-5 sm:px-7 sm:py-7">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="mb-8 flex items-center justify-between sm:mb-10">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition hover:text-slate-600"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200">
              <ArrowLeft className="h-3.5 w-3.5" />
            </span>
            Back
          </Link>
          <img
            src="/logofullcolor.svg"
            alt="True Khmer"
            className="h-8 w-auto sm:h-9"
          />
          <div className="w-[76px]" />
        </div>

        <div className="mx-auto w-full max-w-lg">
          <div className="mb-6 flex justify-center sm:mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <Mail className="h-9 w-9 text-blue-600" strokeWidth={1.75} />
            </div>
          </div>

          <h1 className="text-center text-[30px] font-medium leading-10 text-zinc-900">
            Verify Your Email Address
          </h1>

          <div className="mt-6 space-y-4 text-center">
            <p className="text-base leading-6 text-slate-500">
              A verification code has been sent to{" "}
              <span className="font-semibold text-zinc-900 break-words">
                {email}
              </span>
            </p>
            <p className="text-base leading-6 text-slate-500">
              Please check your inbox and enter the verification code below to
              verify your email address. The code will expire in{" "}
              <span className="font-semibold text-zinc-900">
                {formatTimer(otpRemainingSeconds)}
              </span>
            </p>
          </div>

          <InlineMessage
            tone="warning"
            message={
              hasInitialOtp ? undefined : "We could not send your code yet. Please resend."
            }
            className="mt-4"
          />
          <InlineMessage tone="info" message={infoMessage} className="mt-2" />

          <Form method="post" className="mt-8 space-y-6 sm:mt-9">
            <input type="hidden" name="intent" value="verify" />
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <OtpCodeInput value={otp} onChange={setOtp} />

            <div className="space-y-1">
              <InlineMessage tone="error" message={actionData?.errors?.email} />
              <InlineMessage tone="error" message={actionData?.errors?.otp} />
              <InlineMessage tone="error" message={actionData?.errors?.form} />
            </div>

            <PrimaryButton
              type="submit"
              disabled={!canVerify}
              className="h-10 w-full rounded-lg bg-slate-200 px-6 text-sm font-medium text-slate-500 transition enabled:cursor-pointer enabled:bg-blue-600 enabled:text-white enabled:hover:bg-blue-700 disabled:opacity-70"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </PrimaryButton>
          </Form>

          <InlineMessage
            tone="success"
            message={actionData?.resend?.success ? actionData.resend.message : ""}
            className="mt-4"
          />

          <Form method="post" className="mt-7 text-center">
            <input type="hidden" name="intent" value="resend" />
            <input type="hidden" name="email" value={email} />
            <p className="text-base text-slate-500">
              Didn&apos;t receive any code?{" "}
              <button
                type="submit"
                disabled={!email || isResending || resendCooldownSeconds > 0}
                className="font-medium text-blue-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-400"
              >
                {isResending
                  ? "Sending..."
                  : resendCooldownSeconds > 0
                    ? `Resend in ${formatTimer(resendCooldownSeconds)}`
                    : "Resend Code"}
              </button>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
}
