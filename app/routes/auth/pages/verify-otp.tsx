import { useEffect, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { InlineMessage } from "~/routes/auth/components/inline-message";
import { Button } from "~/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/routes/auth/components/input-otp";
import {
  action as verifyOtpAction,
  loader as verifyOtpLoader,
} from "~/routes/auth/domain/verify-otp.server";
import type { VerifyOtpActionData } from "~/routes/auth/domain/auth.types";
import { Label } from "~/components/ui/label";
import { sanitizeRedirectPath } from "~/lib/redirects";

export const loader = verifyOtpLoader;
export const action = verifyOtpAction;
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
  const actionData = useActionData<VerifyOtpActionData>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email") || "";
  const redirectTo = sanitizeRedirectPath(searchParams.get("redirectTo"));
  const infoMessage = searchParams.get("message") || "";
  const hasInitialOtp = searchParams.get("otpSent") !== "0";
  const backTo = searchParams.get("from") === "login" ? "/login" : "/register";

  const [otp, setOtp] = useState("");
  const otpSlots = [0, 1, 2, 3, 4, 5];
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
    <div className="relative min-h-screen bg-white">
      <Link
        to={backTo}
        className="absolute left-7 top-7 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 transition hover:text-slate-600"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white">
          <ArrowLeft className="h-3.5 w-3.5" />
        </span>
        <span>Back</span>
      </Link>

      <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-4 pb-10 pt-24 sm:px-6 sm:pt-24 lg:px-8 lg:pt-25">
        <img
          src="/logofullcolor.svg"
          alt="True Khmer"
          className="h-12 w-auto"
        />

        <section className="mt-24 flex w-full max-w-134 flex-col items-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
            <Mail className="h-9 w-9 text-blue-600" strokeWidth={1.75} />
          </div>

          <h1 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
            Verify Your Email Address
          </h1>

          <div className="mt-6 space-y-4 text-center">
            <p className="text-base leading-6 text-slate-500">
              A verification code has been sent to{" "}
              <span className="break-words font-semibold text-slate-900">
                {email}
              </span>
            </p>

            <p className="text-base leading-6 text-slate-500">
              Please check your inbox and enter the verification code below to
              verify your email address. The code will expire in{" "}
              <span className="font-semibold text-slate-900">
                {formatTimer(otpRemainingSeconds)}
              </span>
            </p>
          </div>

          <InlineMessage
            tone="warning"
            message={
              hasInitialOtp
                ? undefined
                : "We could not send your code yet. Please resend."
            }
            className="mt-4 w-full"
          />

          <InlineMessage
            tone="info"
            message={infoMessage}
            className="mt-2 w-full"
          />

          <Form method="post" className="mt-8 w-full space-y-6">
            <input type="hidden" name="intent" value="verify" />
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <div className="space-y-2">
              <Label htmlFor="otp" className="sr-only">
                OTP code
              </Label>
              <InputOTP
                id="otp"
                name="otp"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(nextValue) => {
                  const sanitized = nextValue.replace(/\D/g, "").slice(0, 6);
                  setOtp(sanitized);
                }}
                containerClassName="w-full justify-center"
                className="w-full"
              >
                <InputOTPGroup className="w-full justify-between gap-2 border-none bg-transparent p-0">
                  {otpSlots.map((index) => (
                    <InputOTPSlot
                      key={`otp-${index}`}
                      index={index}
                      className="h-12 w-12 rounded-full border border-blue-100 text-sm text-slate-700 first:rounded-full first:border last:rounded-full data-[active=true]:border-blue-500 data-[active=true]:text-blue-600 data-[active=true]:ring-0 data-[active=true]:shadow-none data-[active=true]:aria-invalid:ring-0"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-1">
              <InlineMessage
                tone="error"
                message={actionData?.errors?.email}
              />
              <InlineMessage tone="error" message={actionData?.errors?.otp} />
              <InlineMessage
                tone="error"
                message={actionData?.errors?.form}
              />
            </div>

            <Button
              type="submit"
              disabled={!canVerify}
              className="h-10 w-full rounded-lg bg-slate-200 px-6 text-sm font-medium text-slate-500 transition enabled:cursor-pointer enabled:bg-blue-600 enabled:text-white enabled:hover:bg-blue-700 disabled:opacity-70"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </Form>

          <InlineMessage
            tone="success"
            message={
              actionData?.resend?.success ? actionData.resend.message : ""
            }
            className="mt-4 w-full"
          />

          <Form method="post" className="mt-7 text-center">
            <input type="hidden" name="intent" value="resend" />
            <input type="hidden" name="email" value={email} />

            <p className="text-base text-slate-500">
              Didn&apos;t receive any code?{" "}
              <Button
                type="submit"
                disabled={!email || isResending || resendCooldownSeconds > 0}
                variant="link"
                className="h-auto px-0 font-medium text-blue-600 transition hover:text-blue-700 disabled:text-slate-400"
              >
                {isResending
                  ? "Sending..."
                  : resendCooldownSeconds > 0
                    ? `Resend in ${formatTimer(resendCooldownSeconds)}`
                    : "Resend Code"}
              </Button>
            </p>
          </Form>
        </section>
      </main>
    </div>
  );
}
